package db

import anorm.SqlParser._
import anorm._
import models._
import models.frontend.FrontendOrder
import play.api.Logger
import play.api.Play.current
import play.api.db.DB

import scala.util.control.Breaks._

object ReportDto {
  def getOfOrderId(orderId: Long): Option[AssessmentReport] = {
    DB.withConnection { implicit c =>
      val query = """
        select file, file_cv, file_li, added_at, added_by, d.type as doc_types, position, employer, job_ad_url, customer_comment,
          e.id as edition_id, edition,
          c.id as coupon_id,
          rc.id as red_comment_id, rc.comment as red_comment_text, rc.ordd, rc.points,
          cat.id as red_comment_cat_id, cat.type as red_comment_doc_type,
          tc.id as top_comment_id, tc.comment as top_comment_text,
          cat2.id as top_comment_cat_id, cat2.type as top_comment_doc_type
        from documents d
          inner join product_edition e on e.id = d.edition_id
          left join codes c on c.name = d.code
          left join documents_comments rc on rc.id_doc = d.id
          left join default_categories cat on cat.id = rc.category
          left join single_document_top_comment tc on tc.doc_id = d.id
          left join default_categories cat2 on cat2.id = tc.cate_id
        where d.id = """ + orderId + """
          and d.status = """ + Order.statusIdComplete + """
        order by red_comment_doc_type, red_comment_cat_id, ordd, top_comment_doc_type, top_comment_cat_id, top_comment_id;"""

      Logger.info("ReportDto.getOfOrderId():" + query)

      // Use of `getAliased` because of bug when using the regular `get`
      val rowParser = str("file") ~ str("file_cv") ~ str("file_li") ~ date("added_at") ~ long("added_by") ~ str("doc_types") ~ str("position") ~ str("employer") ~ (str("job_ad_url") ?) ~ (str("customer_comment") ?) ~
        long("edition_id") ~ str("edition") ~
        (long("coupon_id") ?) ~
        (long("red_comment_id") ?) ~ (str("red_comment_text") ?) ~ (int("points") ?) ~
        getAliased[Option[Long]]("red_comment_cat_id") ~ getAliased[Option[String]]("red_comment_doc_type") ~
        (long("top_comment_id") ?) ~ (str("top_comment_text") ?) ~
        (long("top_comment_cat_id") ?) ~ (str("top_comment_doc_type") ?) map {
        case coverLetterFileName ~ cvFileName ~ linkedinProfileFileName ~ creationDate ~ addedBy ~ docTypes ~ positionSought ~ employerSought ~ jobAdUrl ~ customerComment ~
          editionId ~ editionCode ~
          couponId ~
          redCommentId ~ redCommentText ~ weight ~
          redCommentCategoryId ~ redCommentDocType ~
          topCommentId ~ topCommentText ~
          topCommentCategoryId ~ topCommentDocType =>

          val coverLetterFileNameOpt = coverLetterFileName match {
            case "" => None
            case otherString => Some(otherString)
          }

          val cvFileNameOpt = cvFileName match {
            case "" => None
            case otherString => Some(otherString)
          }

          val linkedinProfileFileNameOpt = linkedinProfileFileName match {
            case "" => None
            case otherString => Some(otherString)
          }

          val accountId = addedBy match {
            case AccountDto.unknownUserId => throw new Exception("It shouldn't be possible to retrieve a report for an order assigned to UnknownUser")
            case otherNb => otherNb
          }

          val positionSoughtOpt = positionSought match {
            case "" => None
            case otherString => Some(otherString)
          }

          val employerSoughtOpt = employerSought match {
            case "" => None
            case otherString => Some(otherString)
          }

          val order = FrontendOrder(
            id = orderId,
            edition = Edition(
              id = editionId,
              code = editionCode
            ),
            containedProductCodes = Order.getContainedProductCodesFromTypes(docTypes),
            couponId = couponId,
            cvFileName = cvFileNameOpt,
            coverLetterFileName = coverLetterFileNameOpt,
            linkedinProfileFileName = linkedinProfileFileNameOpt,
            positionSought = positionSoughtOpt,
            employerSought = employerSoughtOpt,
            jobAdUrl = jobAdUrl,
            customerComment = customerComment,
            accountId = Some(accountId),
            status = Order.statusIdComplete,
            creationTimestamp = creationDate.getTime
          )

          val redCommentOpt = redCommentId match {
            case None => None
            case Some(id) => Some(RedComment(
              id = id,
              category = Category(
                id = redCommentCategoryId.get,
                productCode = CruitedProduct.getCodeFromType(redCommentDocType.get)
              ),
              text = redCommentText.get,
              weight = weight.get
            ))
          }

          val topCommentOpt = topCommentId match {
            case None => None
            case Some(id) => Some(TopComment(
              id = id,
              category = Category(
                id = topCommentCategoryId.get,
                productCode = CruitedProduct.getCodeFromType(topCommentDocType.get)
              ),
              text = topCommentText.get
            ))
          }

          (order, redCommentOpt, topCommentOpt)
      }

      normaliseAssessmentReport(SQL(query).as(rowParser.*))
    }
  }

  private def normaliseAssessmentReport(denormalisedAssessmentReport: List[(FrontendOrder, Option[RedComment], Option[TopComment])]): Option[AssessmentReport] = {
    if (denormalisedAssessmentReport.isEmpty)
      None
    else {
      val firstRow = denormalisedAssessmentReport.head

      val order = firstRow._1

      var redComments: List[RedComment] = List()
      var topComments: List[TopComment] = List()

      for (row <- denormalisedAssessmentReport) {
        // Red comment
        if (row._2.isDefined) {
          val redComment = row._2.get
          var isInListAlready = false

          breakable {
            for (commentInList <- redComments) {
              if (commentInList.category.id == redComment.category.id && commentInList.id == redComment.id) {
                // Comments of different categories can have the same ID
                isInListAlready = true
                break()
              }
            }
          }

          if (!isInListAlready) {
            redComments = redComments :+ redComment
          }
        }

        // Top comment
        if (row._3.isDefined) {
          val topComment = row._3.get
          var isInListAlready = false

          breakable {
            for (commentInList <- topComments) {
              if (commentInList.category.id == topComment.category.id && commentInList.id == topComment.id) {
                isInListAlready = true
                break()
              }
            }
          }

          if (!isInListAlready) {
            topComments = topComments :+ topComment
          }
        }
      }

      val redCommentsForCv = redComments.filter(comment => comment.category.productCode == CruitedProduct.codeCvReview)
      val topCommentsForCv = topComments.filter(comment => comment.category.productCode == CruitedProduct.codeCvReview)

      val cvReportOpt = if (redCommentsForCv.isEmpty && topCommentsForCv.isEmpty) {
        None
      } else {
        Some(DocumentReport(
          redComments = redCommentsForCv,
          topComments = topCommentsForCv
        ))
      }

      val redCommentsForCoverLetter = redComments.filter(comment => comment.category.productCode == CruitedProduct.codeCoverLetterReview)
      val topCommentsForCoverLetter = topComments.filter(comment => comment.category.productCode == CruitedProduct.codeCoverLetterReview)

      val coverLetterReportOpt = if (redCommentsForCoverLetter.isEmpty && topCommentsForCoverLetter.isEmpty) {
        None
      } else {
        Some(DocumentReport(
          redComments = redCommentsForCoverLetter,
          topComments = topCommentsForCoverLetter
        ))
      }

      val redCommentsForLinkedinProfile = redComments.filter(comment => comment.category.productCode == CruitedProduct.codeLinkedinProfileReview)
      val topCommentsForLinkedinProfile = topComments.filter(comment => comment.category.productCode == CruitedProduct.codeLinkedinProfileReview)

      val linkedinProfileReportOpt = if (redCommentsForLinkedinProfile.isEmpty && topCommentsForLinkedinProfile.isEmpty) {
        None
      } else {
        Some(DocumentReport(
          redComments = redCommentsForLinkedinProfile,
          topComments = topCommentsForLinkedinProfile
        ))
      }

      Some(AssessmentReport(
        order = order,
        cvReport = cvReportOpt,
        coverLetterReport = coverLetterReportOpt,
        linkedinProfileReport = linkedinProfileReportOpt
      ))
    }
  }

  def getScoresOfOrderId(orderId: Long): AssessmentReportScores = {
    DB.withConnection { implicit c =>
      val query = """
        select `type`, id_category, id_default, criteria_score, score
        from documents_scores
        where id_doc = """ + orderId + """
        order by `type`, id_category, id_default;"""

      Logger.info("ReportDto.getScoresOfOrderId():" + query)

      val rowParser = str("type") ~ long("id_category") ~ long("id_default") ~ int("criteria_score") ~ int("score") map {
        case docType ~ categoryId ~ defaultCommentId ~ score ~ isGreen => (docType, categoryId, defaultCommentId, score, isGreen)
      }

      normaliseScores(SQL(query).as(rowParser.*))
    }
  }

  private def normaliseScores(denormalisedScores: List[(String, Long, Long, Int, Int)]): AssessmentReportScores = {
    val cvReportScores = getReportScores(denormalisedScores.filter(row => row._1 == CruitedProduct.dbTypeCvReview))
    val coverLetterReportScores = getReportScores(denormalisedScores.filter(row => row._1 == CruitedProduct.dbTypeCoverLetterReview))
    val linkedinProfileReportScores = getReportScores(denormalisedScores.filter(row => row._1 == CruitedProduct.dbTypeLinkedinProfileReview))

    AssessmentReportScores(
      cvReportScores = cvReportScores,
      coverLetterReportScores = coverLetterReportScores,
      linkedinProfileReportScores = linkedinProfileReportScores
    )
  }

  private def getReportScores(rows: List[(String, Long, Long, Int, Int)]): Option[DocumentReportScores] = {
    if (rows.isEmpty) {
      None
    } else {
      val allPointsColumn = rows.map(row => row._4)
      val greenPointsColumn = rows.filter(row => row._5 == 1).map(row => row._4)

      def add(total: Int, cur: Int) = total + cur

      val totalPoints = allPointsColumn.reduce(add)
      val totalGreenPoints = greenPointsColumn.reduce(add)
      val totalScore = math.round(totalGreenPoints.toDouble / totalPoints.toDouble * 100).toInt

      var pointsPerCategory: Map[String, Int] = Map() // [Category ID, Score] - Because "No Json serializer found for type Map[Long,Int]"

      for (row <- rows) {
        val categoryId = row._2
        var isInListAlready = false

        breakable {
          for (categoryIdInMap <- pointsPerCategory.keys) {
            if (categoryIdInMap.toLong == categoryId) {
              isInListAlready = true
              break()
            }
          }
        }

        if (!isInListAlready) {
          val categoryRows = rows.filter(row => row._2 == categoryId)

          val categoryAllPointsColumn = categoryRows.map(row => row._4)
          val categoryGreenPointsColumn = categoryRows.filter(row => row._5 == 1).map(row => row._4)

          val categoryPoints = categoryAllPointsColumn.reduce(add)
          val categoryGreenPoints = categoryGreenPointsColumn.reduce(add)
          val categoryScore = math.round(categoryGreenPoints.toDouble / categoryPoints.toDouble * 100).toInt

          pointsPerCategory += (categoryId.toString -> categoryScore)
        }
      }

      Some(DocumentReportScores(
        globalScore = totalScore,
        categoryScores = pointsPerCategory
      ))
    }
  }
}