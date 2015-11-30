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
        select file, file_cv, file_li, added_at, added_by, d.type as doc_types, d.status, position, employer, job_ad_url, score1_cv, score1, score1_li,
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
        order by red_comment_doc_type, red_comment_cat_id, ordd, top_comment_doc_type, top_comment_cat_id, top_comment_id;"""

      Logger.info("ReportDto.getOfOrderId():" + query)

      // Use of `getAliased` because of bug when using the regular `get`
      val rowParser = str("file") ~ str("file_cv") ~ str("file_li") ~ date("added_at") ~ long("added_by") ~ str("doc_types") ~ int("status") ~ str("position") ~ str("employer") ~ (str("job_ad_url") ?) ~ float("score1_cv") ~ float("score1") ~ float("score1_li") ~
        long("edition_id") ~ str("edition") ~
        (long("coupon_id") ?) ~
        (long("red_comment_id") ?) ~ (str("red_comment_text") ?) ~ (int("points") ?) ~
        getAliased[Option[Long]]("red_comment_cat_id") ~ getAliased[Option[String]]("red_comment_doc_type") ~
        (long("top_comment_id") ?) ~ (str("top_comment_text") ?) ~
        (long("top_comment_cat_id") ?) ~ (str("top_comment_doc_type") ?) map {
        case coverLetterFileName ~ cvFileName ~ linkedinProfileFileName ~ creationDate ~ addedBy ~ docTypes ~ status ~ positionSought ~ employerSought ~ jobAdUrl ~ cvScore ~ coverLetterScore ~ linkedinProfileScore ~
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
            case OrderDto.unknownUserId => throw new Exception("It shouldn't be possible to retrieve a report for an order assigned to UnknownUser")
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
            accountId = Some(accountId),
            status = status,
            creationTimestamp = creationDate.getTime
          )

          val cvScoreOpt = cvScore match {
            case 0 => None
            case otherNb => Some(otherNb.toInt)
          }

          val coverLetterScoreOpt = coverLetterScore match {
            case 0 => None
            case otherNb => Some(otherNb.toInt)
          }

          val linkedinProfileScoreOpt = linkedinProfileScore match {
            case 0 => None
            case otherNb => Some(otherNb.toInt)
          }

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

          (order, cvScoreOpt, coverLetterScoreOpt, linkedinProfileScoreOpt, redCommentOpt, topCommentOpt)
      }

      normaliseAssessmentReport(SQL(query).as(rowParser.*))
    }
  }

  private def normaliseAssessmentReport(denormalisedAssessmentReport: List[(FrontendOrder, Option[Int], Option[Int], Option[Int], Option[RedComment], Option[TopComment])]): Option[AssessmentReport] = {
    if (denormalisedAssessmentReport.isEmpty)
      None
    else {
      val firstRow = denormalisedAssessmentReport.head

      val order = firstRow._1
      val cvScoreOpt = firstRow._2
      val coverLetterScoreOpt = firstRow._3
      val linkedinProfileScoreOpt = firstRow._4

      var redComments: List[RedComment] = List()
      var topComments: List[TopComment] = List()

      for (row <- denormalisedAssessmentReport) {
        // Red comment
        if (row._5.isDefined) {
          val redComment = row._5.get
          var isInListAlready = false

          breakable {
            for (commentInList <- redComments) {
              if (!isInListAlready && commentInList.category.id == redComment.category.id && commentInList.id == redComment.id) {
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
        if (row._6.isDefined) {
          val topComment = row._6.get
          var isInListAlready = false

          breakable {
            for (commentInList <- topComments) {
              if (!isInListAlready && commentInList.category.id == topComment.category.id && commentInList.id == topComment.id) {
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

      val cvReportOpt = cvScoreOpt match {
        case None => None
        case Some(score) => Some(DocumentReport(
          score = score,
          redComments = redComments.filter(comment => comment.category.productCode == CruitedProduct.codeCvReview),
          topComments = topComments.filter(comment => comment.category.productCode == CruitedProduct.codeCvReview)
        ))
      }

      val coverLetterReportOpt = coverLetterScoreOpt match {
        case None => None
        case Some(score) => Some(DocumentReport(
          score = score,
          redComments = redComments.filter(comment => comment.category.productCode == CruitedProduct.codeCoverLetterReview),
          topComments = topComments.filter(comment => comment.category.productCode == CruitedProduct.codeCoverLetterReview)
        ))
      }

      val linkedinProfileReportOpt = linkedinProfileScoreOpt match {
        case None => None
        case Some(score) => Some(DocumentReport(
          score = score,
          redComments = redComments.filter(comment => comment.category.productCode == CruitedProduct.codeLinkedinProfileReview),
          topComments = topComments.filter(comment => comment.category.productCode == CruitedProduct.codeLinkedinProfileReview)
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
}
