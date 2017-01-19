package db

import javax.inject.{Inject, Singleton}

import anorm.SqlParser._
import anorm._
import models._
import models.frontend.FrontendCommentVariation
import play.api.Logger
import play.api.db.Database
import services.GlobalConfig

import scala.collection.mutable.ListBuffer
import scala.util.control.Breaks._

@Singleton
class AssessmentDto @Inject()(db: Database, accountDto: AccountDto, config: GlobalConfig) {
  def allDefaultComments: AllDefaultComments = {
    db.withConnection { implicit c =>
      val query = """
      select category as category_id, dc.id, trim(name_good) as green_text, trim(name_bad) as red_text, score, grouped
      from defaults dc
        inner join default_categories c on c.id = dc.category
      where dc.shw = 1
        and c.shw = 1
      order by c.ordd, category, dc.ordd;"""

      Logger.info("AssessmentDto.getAllDefaultComments():" + query)

      val rowParser = long("category_id") ~ long("id") ~ str("green_text") ~ str("red_text") ~ int("score") ~ int("grouped") map {
        case categoryId ~ id ~ greenText ~ redText ~ points ~ grouped =>

          val defaultComment = DefaultComment(
            id = id,
            categoryId = categoryId,
            greenText = greenText,
            redText = redText,
            points = points,
            isGrouped = grouped match {
              case DefaultComment.dbGroupedFalse => false
              case _ => true
            }
          )

          (defaultComment, CruitedProduct.codeFromCategoryId(categoryId))
      }

      process(SQL(query).as(rowParser.*))
    }
  }

  def allCommentVariations: List[FrontendCommentVariation] = {
    db.withConnection { implicit c =>
      val query = """
      select v.id, variation,
        dc.id as id_default, category as category_id, trim(name_good) as name_good, trim(name_bad) as name_bad, dc.type as doc_type, score, grouped,
        e.id as edition_id, e.edition as edition_code
      from default_variations v
        inner join defaults dc on dc.id = v.id_default
        inner join default_categories c on c.id = dc.category
        inner join product_edition_variation variation_type on variation_type.variation_id = v.id
        left join product_edition e on e.id = variation_type.edition_id
      where v.shw = 1
        and dc.shw = 1
        and c.shw = 1
      order by id_default, tag_type;"""

      Logger.info("AssessmentDto.getAllCommentVariations():" + query)

      val rowParser = long("id") ~ str("variation") ~
        long("id_default") ~ long("category_id") ~ str("name_good") ~ str("name_bad") ~ str("doc_type") ~ int("score") ~ int("grouped") ~
        (long("edition_id") ?) ~ (str("edition_code") ?) map {
        case id ~ text ~
          defaultCommentId ~ categoryId ~ greenText ~ redText ~ dbDocType ~ points ~ grouped ~
          editionIdOpt ~ editionCodeOpt =>

          FrontendCommentVariation(
            id = id,
            defaultComment = DefaultComment(
              id = defaultCommentId,
              categoryId = categoryId,
              greenText = greenText,
              redText = redText,
              points = points,
              isGrouped = grouped match {
                case DefaultComment.dbGroupedFalse => false
                case _ => true
              }
            ),
            text = text,
            edition = editionIdOpt match {
              case Some(editionId) => Some(Edition(
                id = editionId,
                code = editionCodeOpt.get
              ))

              case _ => None
            }
          )
      }

      SQL(query).as(rowParser.*)
    }
  }

  def getIdsOfTheLastNReports(n: Int, docType: String): List[Long] = {
    db.withConnection { implicit c =>
      val query = """
        select distinct id
        from documents d
        where `type` like '%""" + docType + """%'
          and status = """ + Order.statusIdComplete + """
        order by last_rate desc
        limit """ + n + """;"""

      Logger.info("AssessmentDto.idsOfTheLastNReports():" + query)

      val rowParser = long("id") map {
        case id => id
      }

      SQL(query).as(rowParser.*)
    }
  }

  def getOfOrderId(orderId: Long): Option[Assessment] = {
    val (cvReportOpt, coverLetterReportOpt, linkedinProfileReportOpt) = getDocumentReportsOfOrderId(orderId)

    if (cvReportOpt.isEmpty && coverLetterReportOpt.isEmpty && linkedinProfileReportOpt.isEmpty) {
      None
    } else {
      val (cvCommentList, coverLetterCommentList, linkedinProfileCommentList) = getCommentListsOfOrderId(orderId)

      Some(Assessment(
        orderId = orderId,

        cvCommentList = cvCommentList,
        coverLetterCommentList = coverLetterCommentList,
        linkedinProfileCommentList = linkedinProfileCommentList,

        cvReport = cvReportOpt,
        coverLetterReport = coverLetterReportOpt,
        linkedinProfileReport = linkedinProfileReportOpt
      ))
    }
  }

  def deleteOfOrderId(id: Long) {
    deleteScoresOfOrderId(id)
    deleteWellDoneCommentsOfOrderId(id)
    deleteRedCommentsOfOrderId(id)
    deleteOverallCommentsOfOrderId(id)
  }

  def createAssessment(assessment: Assessment) {
    createOverallComments(assessment)

    val orderId = assessment.orderId

    assessment.cvReport match {
      case None =>
      case Some(docReport) =>
        createRedComments(docReport.redComments, orderId)
        createWellDoneComments(docReport.wellDoneComments, orderId)
        createScores(CruitedProduct.dbTypeCvReview, assessment.cvCommentList, orderId)
    }

    assessment.coverLetterReport match {
      case None =>
      case Some(docReport) =>
        createRedComments(docReport.redComments, orderId)
        createWellDoneComments(docReport.wellDoneComments, orderId)
        createScores(CruitedProduct.dbTypeCoverLetterReview, assessment.coverLetterCommentList, orderId)
    }

    assessment.linkedinProfileReport match {
      case None =>
      case Some(docReport) =>
        createRedComments(docReport.redComments, orderId)
        createWellDoneComments(docReport.wellDoneComments, orderId)
        createScores(CruitedProduct.dbTypeLinkedinProfileReview, assessment.linkedinProfileCommentList, orderId)
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
      // Logger.info("AssessmentDto.getScoresOfOrderId():" + query)

      val rowParser = str("type") ~ long("id_category") ~ long("id_default") ~ int("criteria_score") ~ int("score") map {
        case docType ~ categoryId ~ defaultCommentId ~ score ~ isGreen => (docType, categoryId, defaultCommentId, score, isGreen)
      }

      normaliseScores(SQL(query).as(rowParser.*))
    }
  }

  /**
   * @param allComments (DefaultComment, CruitedProduct.codeXYZ)
   */
  private def process(allComments: List[(DefaultComment, String)]): AllDefaultComments = {
    val cvDefaultComments = new ListBuffer[DefaultComment]
    val coverLetterDefaultComments = new ListBuffer[DefaultComment]
    val linkedinProfileDefaultComments = new ListBuffer[DefaultComment]

    for ((defaultComment, productCode) <- allComments) {
      productCode match {
        case CruitedProduct.codeCvReview => cvDefaultComments += defaultComment;
        case CruitedProduct.codeCoverLetterReview => coverLetterDefaultComments += defaultComment;
        case _ => linkedinProfileDefaultComments += defaultComment;
      }
    }

    AllDefaultComments(
      cv = cvDefaultComments.toList,
      coverLetter = coverLetterDefaultComments.toList,
      linkedinProfile = linkedinProfileDefaultComments.toList
    )
  }

  private def getCommentListsOfOrderId(orderId: Long): (List[AssessmentComment], List[AssessmentComment], List[AssessmentComment]) = {
    db.withConnection { implicit c =>
      val query = """
        select s.score as is_green,
          dc.category as category_id, dc.id as default_comment_id, trim(name_good) as green_text, trim(name_bad) as red_text, dc.score, grouped,
          rc.comment as red_comment_text
        from documents_scores s
          inner join defaults dc on dc.id = s.id_default
          left join documents_comments rc on rc.id_doc = s.id_doc and rc.id_default = s.id_default
        where s.id_doc = """ + orderId + """
        order by category_id, dc.ordd;"""

      Logger.info("AssessmentDto.getCommentListsOfOrderId():" + query)

      val rowParser = int("is_green") ~
        long("category_id") ~ long("default_comment_id") ~ str("green_text") ~ str("red_text") ~ int("score") ~ int("grouped") ~
        (str("red_comment_text") ?) map {
        case isGreen ~
          categoryId ~ defaultCommentId ~ defaultCommentGreenText ~ defaultCommentRedText ~ points ~ grouped ~
          redCommentTextOpt => (isGreen, categoryId, defaultCommentId, defaultCommentGreenText, defaultCommentRedText, points, grouped, redCommentTextOpt)
      }

      normaliseCommentLists(SQL(query).as(rowParser.*))
    }
  }

  // Using JDBC here instead of Anorm due to issue https://github.com/playframework/anorm/issues/122
  private def getDocumentReportsOfOrderId(orderId: Long): (Option[DocumentReport], Option[DocumentReport], Option[DocumentReport]) = {
    val query = """
      select custom_comment_cv, custom_comment, custom_comment_li,
        rc.id_default, rc.comment as red_comment_text, rc.ordd as red_comment_order, rc.points,
        cat.id as red_comment_cat_id, cat.type as red_comment_doc_type, cat.ordd as red_comment_category_order,
        tc.comment as top_comment_text,
        cat2.id as top_comment_cat_id, cat2.type as top_comment_doc_type
      from documents d
        left join documents_comments rc on rc.id_doc = d.id
        left join default_categories cat on cat.id = rc.category
        left join single_document_top_comment tc on tc.doc_id = d.id
        left join default_categories cat2 on cat2.id = tc.cate_id
      where d.id = """ + orderId + """
        and d.status > """ + Order.statusIdPaid + """
      order by red_comment_doc_type, red_comment_category_order, red_comment_cat_id, red_comment_order, top_comment_doc_type, top_comment_cat_id;"""

    Logger.info("AssessmentDto.getDocumentReportsOfOrderId():" + query)

    var denormalisedDocumentReports = new ListBuffer[(Option[RedComment], Option[WellDoneComment], Option[String], Option[String], Option[String])]()
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

        val denormalisedDocumentReport = (redCommentOpt, wellDoneCommentOpt, cvOverallCommentOpt, coverLetterOverallCommentOpt, linkedinProfileOverallCommentOpt)
        denormalisedDocumentReports += denormalisedDocumentReport
      }

      normaliseDocumentReports(denormalisedDocumentReports.toList)
    } finally {
      conn.close()
    }
  }

  private def deleteScoresOfOrderId(id: Long) {
    db.withConnection { implicit c =>
      val query = """
        delete from documents_scores
        where id_doc = """ + id + """;"""

      Logger.info("AssessmentDto.deleteScoresOfOrderId():" + query)

      SQL(query).executeUpdate()
    }
  }

  private def deleteWellDoneCommentsOfOrderId(id: Long) {
    db.withConnection { implicit c =>
      val query = """
        delete from single_document_top_comment
        where doc_id = """ + id + """;"""

      Logger.info("AssessmentDto.deleteWellDoneCommentsOfOrderId():" + query)

      SQL(query).executeUpdate()
    }
  }

  private def deleteRedCommentsOfOrderId(id: Long) {
    db.withConnection { implicit c =>
      val query = """
        delete from documents_comments
        where id_doc = """ + id + """;"""

      Logger.info("AssessmentDto.deleteRedCommentsOfOrderId():" + query)

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

      Logger.info("AssessmentDto.deleteOverallCommentsOfOrderId():" + query)

      SQL(query).executeUpdate()
    }
  }

  private def createOverallComments(assessment: Assessment) {
    db.withConnection { implicit c =>
      val noOverallCommentClauseCv = """
        custom_comment_cv = ''"""

      val clauseOverallCommentCv = assessment.cvReport match {
        case None => noOverallCommentClauseCv
        case Some(docReport) => docReport.overallComment match {
          case None => noOverallCommentClauseCv
          case Some(overallComment) => """
            custom_comment_cv = '""" + overallComment + """'"""
        }
      }


      val noOverallCommentClauseCoverLetter = """
        custom_comment = ''"""

      val clauseOverallCommentCoverLetter = assessment.coverLetterReport match {
        case None => noOverallCommentClauseCoverLetter
        case Some(docReport) => docReport.overallComment match {
          case None => noOverallCommentClauseCoverLetter
          case Some(overallComment) => """
            custom_comment = '""" + overallComment + """'"""
        }
      }


      val noOverallCommentClauseLinkedinProfile = """
        custom_comment_li = ''"""

      val clauseOverallCommentLinkedinProfile = assessment.coverLetterReport match {
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
        where id = """ + assessment.orderId + """;"""

      Logger.info("AssessmentDto.createOverallComments():" + query)

      SQL(query).executeUpdate()
    }
  }

  // Using JDBC here instead of Anorm due to issue https://github.com/playframework/anorm/issues/136
  private def createRedComments(redComments: List[RedComment], orderId: Long) {
    db.withConnection { implicit c =>
      val conn = db.getConnection()
      try {
        for (i <- 0 to redComments.length - 1) {
          val redComment = redComments.apply(i)

          val query = """
            insert into documents_comments(id_doc, id_default, category, comment, ordd, points, checked)
            values(""" + orderId + """, """ +
            redComment.defaultCommentId.getOrElse("NULL") + """, """ +
            redComment.categoryId + """, '""" +
            DbUtil.safetize(redComment.text) + """', """ +
            i + 1 + """, """ +
            redComment.points.getOrElse(0) + """,
            1)"""

          Logger.info("AssessmentDto.createRedComments():" + query)

          conn.createStatement.executeUpdate(query)
        }
      } finally {
        conn.close()
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

        Logger.info("AssessmentDto.createWellDoneCommentForDocReport():" + query)

        SQL(query).executeInsert()
      }
    }
  }

  private def createScores(productTypeDb: String, listComments: List[AssessmentComment], orderId: Long) {
    db.withConnection { implicit c =>
      for (listComment <- listComments) {
        val categoryId = listComment.defaultComment.categoryId
        val productTypeDb = CruitedProduct.typeFromCode(CruitedProduct.codeFromCategoryId(categoryId))
        val commentId = listComment.defaultComment.id
        val points = listComment.defaultComment.points

        val isGreenValueForDb = if (listComment.isGreenSelected) {
          1
        } else {
          0
        }

        val query = """
          insert into documents_scores(id_doc, `type`, id_category, id_default, criteria_score, score)
          values(""" + orderId + """, '""" +
          productTypeDb + """', """ +
          categoryId + """, """ +
          commentId + """, """ +
          points + """, """ +
          isGreenValueForDb + """)"""

        Logger.info("AssessmentDto.createScores():" + query)

        SQL(query).executeInsert()
      }
    }
  }

  /**
   *
   * @param rows List[(redCommentOpt, wellDoneCommentOpt, cvOverallCommentOpt, coverLetterOverallCommentOpt, linkedinProfileOverallCommentOpt)]
   * @return (cvReportOpt, coverLetterReportOpt, linkedinProfileReportOpt)
   */
  private def normaliseDocumentReports(rows: List[(Option[RedComment], Option[WellDoneComment], Option[String], Option[String], Option[String])]): (Option[DocumentReport], Option[DocumentReport], Option[DocumentReport]) = {
    if (rows.isEmpty)
      (None, None, None)
    else {
      val firstRow = rows.head

      val cvOverallCommentOpt = firstRow._3
      val coverLetterOverallCommentOpt = firstRow._4
      val linkedinProfileOverallCommentOpt = firstRow._5

      var redComments: List[RedComment] = List()
      var wellDoneComments: List[WellDoneComment] = List()

      for (row <- rows) {
        // Red comment
        if (row._1.isDefined) {
          val redComment = row._1.get
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
        if (row._2.isDefined) {
          val wellDoneComment = row._2.get
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

      (cvReportOpt, coverLetterReportOpt, linkedinProfileReportOpt)
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

  /**
   *
   * @param rows List[(isGreen, categoryId, defaultCommentId, defaultCommentGreenText, defaultCommentRedText, points, grouped, redCommentTextOpt)]
   * @return (cvCommentList, coverLetterCommentList, linkedinProfileCommentList)
   */
  private def normaliseCommentLists(rows: List[(Int, Long, Long, String, String, Int, Int, Option[String])]): (List[AssessmentComment], List[AssessmentComment], List[AssessmentComment]) = {
    val cvCommentList = new ListBuffer[AssessmentComment]()
    val coverLetterCommentList = new ListBuffer[AssessmentComment]()
    val linkedinProfileCommentList = new ListBuffer[AssessmentComment]()

    if (rows.nonEmpty) {
      for (row <- rows) {
        val categoryId = row._2
        val productCode = CruitedProduct.codeFromCategoryId(categoryId)

        val assessmentComment = AssessmentComment(
          defaultComment = DefaultComment(
            id = row._3,
            categoryId = categoryId,
            greenText = row._4,
            redText = row._5,
            points = row._6,
            isGrouped = row._7 == 1
          ),
          isGreenSelected = row._1 == 1,
          redText = row._8
        )

        if (productCode == CruitedProduct.codeCvReview) {
          cvCommentList += assessmentComment
        } else if (productCode == CruitedProduct.codeCoverLetterReview) {
          coverLetterCommentList += assessmentComment
        } else {
          linkedinProfileCommentList += assessmentComment
        }
      }
    }

    (cvCommentList.toList, coverLetterCommentList.toList, linkedinProfileCommentList.toList)
  }
}
