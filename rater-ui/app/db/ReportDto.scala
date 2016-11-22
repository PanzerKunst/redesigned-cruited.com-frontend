package db

import javax.inject.{Inject, Singleton}

import anorm.SqlParser._
import anorm._
import models._
import play.api.Logger
import play.api.db.Database
import services.GlobalConfig

import scala.collection.mutable
import scala.collection.mutable.ListBuffer
import scala.util.control.Breaks._

@Singleton
class ReportDto @Inject()(db: Database, accountDto: AccountDto, assessmentDto: AssessmentDto, config: GlobalConfig) {
  def getIdsOfTheLastNReports(n: Int, docType: String): List[Long] = {
    db.withConnection { implicit c =>
      val query = """
        select distinct id
        from documents d
        where `type` like '%""" + docType + """%'
          and status = """ + Order.statusIdComplete + """
        order by last_rate desc
        limit """ + n + """;"""

      Logger.info("ReportDto.idsOfTheLastNReports():" + query)

      val rowParser = long("id") map {
        case id => id
      }

      SQL(query).as(rowParser.*)
    }
  }

  /* Using JDBC here instead of Anorm due to issue https://github.com/playframework/anorm/issues/122 */
  def getOfOrderId(orderId: Long): Option[AssessmentReport] = {
    db.withConnection { implicit c =>
      val query = """
        select custom_comment_cv, custom_comment, custom_comment_li,
          rc.id_default, rc.comment as red_comment_text, rc.ordd, rc.points,
          cat.id as red_comment_cat_id, cat.type as red_comment_doc_type,
          tc.comment as top_comment_text,
          cat2.id as top_comment_cat_id, cat2.type as top_comment_doc_type
        from documents d
          left join documents_comments rc on rc.id_doc = d.id
          left join default_categories cat on cat.id = rc.category
          left join single_document_top_comment tc on tc.doc_id = d.id
          left join default_categories cat2 on cat2.id = tc.cate_id
        where d.id = """ + orderId + """
          and d.status > """ + Order.statusIdPaid + """
        order by red_comment_doc_type, red_comment_cat_id, ordd, top_comment_doc_type, top_comment_cat_id;"""

      Logger.info("ReportDto.getOfOrderId():" + query)

      var denormalisedAssessmentReports = new ListBuffer[(Long, Option[RedComment], Option[WellDoneComment], Option[String], Option[String], Option[String])]()
      val conn = db.getConnection()

      try {
        val rs = conn.createStatement.executeQuery(query)

        while (rs.next()) {

          // redCommentOpt

          val redCommentCategoryId = rs.getLong("red_comment_cat_id")
          val redCommentCategoryIdOpt = if (rs.wasNull()) {
            None
          } else {
            Some(redCommentCategoryId)
          }

          val defaultCommentId = rs.getLong("id_default")
          val defaultCommentIdOpt = if (rs.wasNull()) {
            None
          } else {
            Some(defaultCommentId)
          }

          val points = rs.getInt("points")
          val pointsOpt = if (rs.wasNull()) {
            None
          } else {
            Some(points)
          }

          val redCommentText = rs.getString("red_comment_text")
          val redCommentOpt = if (rs.wasNull()) {
            None
          } else {
            Some(RedComment(
              defaultCommentId = defaultCommentIdOpt,
              categoryId = redCommentCategoryIdOpt.get,
              text = redCommentText,
              points = pointsOpt
            ))
          }


          // wellDoneCommentOpt

          val wellDoneCommentCategoryId = rs.getLong("top_comment_cat_id")
          val wellDoneCommentCategoryIdOpt = if (rs.wasNull()) {
            None
          } else {
            Some(wellDoneCommentCategoryId)
          }

          val wellDoneCommentText = rs.getString("top_comment_text")
          val wellDoneCommentTextOpt = if (rs.wasNull()) {
            None
          } else {
            Some(wellDoneCommentText)
          }

          val wellDoneCommentOpt = if (rs.wasNull()) {
            None
          } else {
            Some(WellDoneComment(
              categoryId = wellDoneCommentCategoryIdOpt.get,
              text = wellDoneCommentTextOpt.get
            ))
          }


          val cvOverallCommentOpt = rs.getString("custom_comment_cv") match {
            case "" => None
            case otherString => Some(otherString)
          }


          val coverLetterOverallCommentOpt = rs.getString("custom_comment") match {
            case "" => None
            case otherString => Some(otherString)
          }


          val linkedinProfileOverallCommentOpt = rs.getString("custom_comment_li") match {
            case "" => None
            case otherString => Some(otherString)
          }

          val denormalisedAssessmentReport = (orderId, redCommentOpt, wellDoneCommentOpt, cvOverallCommentOpt, coverLetterOverallCommentOpt, linkedinProfileOverallCommentOpt)
          denormalisedAssessmentReports += denormalisedAssessmentReport
        }

        normaliseAssessmentReport(denormalisedAssessmentReports.toList)
      } finally {
        conn.close()
      }
    }
  }

  def deleteOfOrderId(id: Long) {
    deleteScoresOfOrderId(id)
    deleteWellDoneCommentsOfOrderId(id)
    deleteRedCommentsOfOrderId(id)
    deleteOverallCommentsOfOrderId(id)
  }

  def create(assessmentReport: AssessmentReport) {
    createOverallComments(assessmentReport)

    val orderId = assessmentReport.orderId

    assessmentReport.cvReport match {
      case None =>
      case Some(docReport) =>
        createRedComments(docReport.redComments, orderId)
        createWellDoneComments(docReport.wellDoneComments, orderId)
        createScores(CruitedProduct.dbTypeCvReview, docReport.redComments, orderId)
    }

    assessmentReport.coverLetterReport match {
      case None =>
      case Some(docReport) =>
        createRedComments(docReport.redComments, orderId)
        createWellDoneComments(docReport.wellDoneComments, orderId)
        createScores(CruitedProduct.dbTypeCoverLetterReview, docReport.redComments, orderId)
    }

    assessmentReport.linkedinProfileReport match {
      case None =>
      case Some(docReport) =>
        createRedComments(docReport.redComments, orderId)
        createWellDoneComments(docReport.wellDoneComments, orderId)
        createScores(CruitedProduct.dbTypeLinkedinProfileReview, docReport.redComments, orderId)
    }
  }

  def getScoresOfOrderId(orderId: Long): AssessmentReportScores = {
    db.withConnection { implicit c =>
      val query = """
        select `type`, id_category, id_default, criteria_score, score
        from documents_scores
        where id_doc = """ + orderId + """
        order by `type`, id_category, id_default;"""

      // Commented out because spams too much when average scores are calculated
      // Logger.info("ReportDto.getScoresOfOrderId():" + query)

      val rowParser = str("type") ~ long("id_category") ~ long("id_default") ~ int("criteria_score") ~ int("score") map {
        case docType ~ categoryId ~ defaultCommentId ~ score ~ isGreen => (docType, categoryId, defaultCommentId, score, isGreen)
      }

      normaliseScores(SQL(query).as(rowParser.*))
    }
  }

  private def deleteScoresOfOrderId(id: Long) {
    db.withConnection { implicit c =>
      val query = """
        delete from documents_scores
        where id_doc = """ + id + """;"""

      Logger.info("ReportDto.deleteScoresOfOrderId():" + query)

      SQL(query).executeUpdate()
    }
  }

  private def deleteWellDoneCommentsOfOrderId(id: Long) {
    db.withConnection { implicit c =>
      val query = """
        delete from single_document_top_comment
        where doc_id = """ + id + """;"""

      Logger.info("ReportDto.deleteWellDoneCommentsOfOrderId():" + query)

      SQL(query).executeUpdate()
    }
  }

  private def deleteRedCommentsOfOrderId(id: Long) {
    db.withConnection { implicit c =>
      val query = """
        delete from documents_comments
        where id_doc = """ + id + """;"""

      Logger.info("ReportDto.deleteRedCommentsOfOrderId():" + query)

      SQL(query).executeUpdate()
    }
  }

  private def deleteOverallCommentsOfOrderId(id: Long) {
    db.withConnection { implicit c =>
      val query = """
        update documents
        set custom_comment_cv = '',
          custom_comment = '',
          custom_comment_li = ''
        where id = """ + id + """;"""

      Logger.info("ReportDto.deleteOverallCommentsOfOrderId():" + query)

      SQL(query).executeUpdate()
    }
  }

  private def createOverallComments(assessmentReport: AssessmentReport) {
    db.withConnection { implicit c =>
      val noOverallCommentClauseCv = """
        custom_comment_cv = ''"""

      val clauseOverallCommentCv = assessmentReport.cvReport match {
        case None => noOverallCommentClauseCv
        case Some(docReport) => docReport.overallComment match {
          case None => noOverallCommentClauseCv
          case Some(overallComment) => """
            custom_comment_cv = '""" + overallComment + """'"""
        }
      }


      val noOverallCommentClauseCoverLetter = """
        custom_comment = ''"""

      val clauseOverallCommentCoverLetter = assessmentReport.coverLetterReport match {
        case None => noOverallCommentClauseCoverLetter
        case Some(docReport) => docReport.overallComment match {
          case None => noOverallCommentClauseCoverLetter
          case Some(overallComment) => """
            custom_comment = '""" + overallComment + """'"""
        }
      }


      val noOverallCommentClauseLinkedinProfile = """
        custom_comment_li = ''"""

      val clauseOverallCommentLinkedinProfile = assessmentReport.coverLetterReport match {
        case None => noOverallCommentClauseLinkedinProfile
        case Some(docReport) => docReport.overallComment match {
          case None => noOverallCommentClauseLinkedinProfile
          case Some(overallComment) => """
            custom_comment_li = '""" + overallComment + """'"""
        }
      }

      val query = """
        update documents
        set """ + clauseOverallCommentCv + """, """ +
          clauseOverallCommentCoverLetter + """, """ +
          clauseOverallCommentLinkedinProfile + """
        where id = """ + assessmentReport.orderId + """;"""

      Logger.info("ReportDto.createOverallComments():" + query)

      SQL(query).executeUpdate()
    }
  }

  private def createRedComments(redComments: List[RedComment], orderId: Long) {
    db.withConnection { implicit c =>
      for (i <- 0 to redComments.length-1) {
        val redComment = redComments.apply(i)

        val query = """
          insert into documents_comments(id_doc, id_default, category, comment, ordd, points, checked)
          values(""" + orderId + """, """ +
            redComment.defaultCommentId.getOrElse("NULL") + """, """ +
            redComment.categoryId + """, '""" +
            DbUtil.safetize(redComment.text) + """', """ +
            i+1 + """, """ +
            redComment.points.getOrElse(0) + """,
            1)"""

        Logger.info("ReportDto.createRedComments():" + query)

        SQL(query).executeInsert()
      }
    }
  }

  private def createWellDoneComments(wellDoneComments: List[WellDoneComment], orderId: Long) {
    db.withConnection { implicit c =>
      for (wellDoneComment <- wellDoneComments) {
        val query = """
          insert into single_document_top_comment(doc_id, cate_id, comment)
          values(""" + orderId + """, """ +
          wellDoneComment.categoryId + """, '""" +
          DbUtil.safetize(wellDoneComment.text) + """')"""

        Logger.info("ReportDto.createWellDoneCommentForDocReport():" + query)

        SQL(query).executeInsert()
      }
    }
  }

  private def createScores(productTypeDb: String, redComments: List[RedComment], orderId: Long) {
    db.withConnection { implicit c =>

      /* For each default comment
      if `redComments` contains it, then insert into documents_scores with `score` = 0
      else, we insert into documents_scores with `score` = 1
       */

      val allDefaultComments = assessmentDto.allDefaultComments

      val defaultCommentsForThisDoc = if (productTypeDb == CruitedProduct.dbTypeCvReview) {
        allDefaultComments.cv
      } else if (productTypeDb == CruitedProduct.dbTypeCoverLetterReview) {
        allDefaultComments.coverLetter
      } else {
        allDefaultComments.linkedinProfile
      }

      for (defaultComment <- defaultCommentsForThisDoc) {
        val commentId = defaultComment.id
        val isRed = redComments.exists(_.defaultCommentId.get == commentId) // TODO: `defaultCommentId.get` isn't gonna fly here for custom comments...

        val isGreenValueForDb = if (isRed) {
          0
        } else {
          1
        }

        val query = """
            insert into documents_scores(id_doc, `type`, id_category, id_default, criteria_score, score)
            values(""" + orderId + """, '""" +
          productTypeDb + """', """ +
          defaultComment.categoryId + """, """ +
          commentId + """, """ +
          defaultComment.points + """, """ +
          isGreenValueForDb + """)"""

        Logger.info("ReportDto.createScores():" + query)

        SQL(query).executeInsert()
      }
    }
  }

  /**
   *
   * @param denormalisedAssessmentReport List[(orderId, redCommentOpt, wellDoneCommentOpt, cvOverallCommentOpt, coverLetterOverallCommentOpt, linkedinProfileOverallCommentOpt)]
   * @return
   */
  private def normaliseAssessmentReport(denormalisedAssessmentReport: List[(Long, Option[RedComment], Option[WellDoneComment], Option[String], Option[String], Option[String])]): Option[AssessmentReport] = {
    if (denormalisedAssessmentReport.isEmpty)
      None
    else {
      val firstRow = denormalisedAssessmentReport.head

      val orderId = firstRow._1
      val cvOverallCommentOpt = firstRow._4
      val coverLetterOverallCommentOpt = firstRow._5
      val linkedinProfileOverallCommentOpt = firstRow._6

      var redComments: List[RedComment] = List()
      var wellDoneComments: List[WellDoneComment] = List()

      for (row <- denormalisedAssessmentReport) {
        // Red comment
        if (row._2.isDefined) {
          val redComment = row._2.get
          var isInListAlready = false

          breakable {
            for (commentInList <- redComments) {
              if (commentInList.categoryId == redComment.categoryId && commentInList.defaultCommentId == redComment.defaultCommentId) {
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

        // Well Done comment
        if (row._3.isDefined) {
          val wellDoneComment = row._3.get
          var isInListAlready = false

          breakable {
            for (commentInList <- wellDoneComments) {
              if (commentInList.categoryId == wellDoneComment.categoryId) {
                isInListAlready = true
                break()
              }
            }
          }

          if (!isInListAlready) {
            wellDoneComments = wellDoneComments :+ wellDoneComment
          }
        }
      }

      val redCommentsForCv = redComments.filter(comment => CruitedProduct.codeFromCategoryId(comment.categoryId) == CruitedProduct.codeCvReview)
      val wellDoneCommentsForCv = wellDoneComments.filter(comment => CruitedProduct.codeFromCategoryId(comment.categoryId) == CruitedProduct.codeCvReview)

      val cvReportOpt = if (redCommentsForCv.isEmpty && wellDoneCommentsForCv.isEmpty) {
        None
      } else {
        Some(DocumentReport(
          redComments = redCommentsForCv,
          wellDoneComments = wellDoneCommentsForCv,
          overallComment = cvOverallCommentOpt
        ))
      }

      val redCommentsForCoverLetter = redComments.filter(comment => CruitedProduct.codeFromCategoryId(comment.categoryId) == CruitedProduct.codeCoverLetterReview)
      val wellDoneCommentsForCoverLetter = wellDoneComments.filter(comment => CruitedProduct.codeFromCategoryId(comment.categoryId) == CruitedProduct.codeCoverLetterReview)

      val coverLetterReportOpt = if (redCommentsForCoverLetter.isEmpty && wellDoneCommentsForCoverLetter.isEmpty) {
        None
      } else {
        Some(DocumentReport(
          redComments = redCommentsForCoverLetter,
          wellDoneComments = wellDoneCommentsForCoverLetter,
          overallComment = coverLetterOverallCommentOpt
        ))
      }

      val redCommentsForLinkedinProfile = redComments.filter(comment => CruitedProduct.codeFromCategoryId(comment.categoryId) == CruitedProduct.codeLinkedinProfileReview)
      val wellDoneCommentsForLinkedinProfile = wellDoneComments.filter(comment => CruitedProduct.codeFromCategoryId(comment.categoryId) == CruitedProduct.codeLinkedinProfileReview)

      val linkedinProfileReportOpt = if (redCommentsForLinkedinProfile.isEmpty && wellDoneCommentsForLinkedinProfile.isEmpty) {
        None
      } else {
        Some(DocumentReport(
          redComments = redCommentsForLinkedinProfile,
          wellDoneComments = wellDoneCommentsForLinkedinProfile,
          overallComment = linkedinProfileOverallCommentOpt
        ))
      }

      Some(AssessmentReport(
        orderId = orderId,
        cvReport = cvReportOpt,
        coverLetterReport = coverLetterReportOpt,
        linkedinProfileReport = linkedinProfileReportOpt
      ))
    }
  }

  /**
   *
   * @param denormalisedScores List[(docType, categoryId, defaultCommentId, score, isGreen)]
   * @return
   */
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

  /**
   * For categories:
   * [sum of scores for all greens] / [sum of all scores in the category] * 100
   *
   * For document total:
   * [sum of scores for all greens in all categories] / [sum of scores for all criteria in all categories] * 100
   *
   * @param rows List[(docType, categoryId, defaultCommentId, score, isGreen)]
   * @return
   */
  private def getReportScores(rows: List[(String, Long, Long, Int, Int)]): Option[DocumentReportScores] = {
    if (rows.isEmpty) {
      None
    } else {
      val allPointsColumn = rows.map(row => row._4)
      val greenPointsColumn = rows.filter(row => row._5 == 1).map(row => row._4)

      def add(total: Int, cur: Int) = total + cur

      val totalPoints = allPointsColumn.reduce(add)

      val totalGreenPoints = if (greenPointsColumn.isEmpty) {
        0
      } else {
        greenPointsColumn.reduce(add)
      }

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

          val categoryGreenPoints = if (categoryGreenPointsColumn.isEmpty) {
            0
          } else {
            categoryGreenPointsColumn.reduce(add)
          }

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
