package db

import anorm.SqlParser.{date, long, str}
import anorm._
import models._
import play.api.Logger
import play.api.Play.current
import play.api.db.DB

object InterviewTrainingOrderInfoDto {
  def create(orderInfo: InterviewTrainingOrderInfo): Option[Long] = {
    DB.withConnection { implicit c =>
      val interviewDateClause = orderInfo.interviewDate match {
        case None => "NULL"
        case Some(interviewDate) => "'" + DbUtil.safetize(DbUtil.DateFormat.format(interviewDate)) + "'"
      }

      val importantForTheRoleClause = orderInfo.importantForTheRole match {
        case None => "NULL"
        case Some(importantForTheRole) => "'" + DbUtil.safetize(importantForTheRole) + "'"
      }

      val latestInterviewClause = orderInfo.latestInterview match {
        case None => "NULL"
        case Some(latestInterview) => "'" + DbUtil.safetize(latestInterview) + "'"
      }

      val needForImprovementClause = orderInfo.needForImprovement match {
        case None => "NULL"
        case Some(needForImprovement) => "'" + DbUtil.safetize(needForImprovement) + "'"
      }

      val challengingQuestionsClause = orderInfo.challengingQuestions match {
        case None => "NULL"
        case Some(challengingQuestions) => "'" + DbUtil.safetize(challengingQuestions) + "'"
      }

      val query = """
      insert into it_order_info(order_id, interview_date, important_for_the_role, latest_interview, need_for_improvement, challenging_questions)
      values(""" + orderInfo.orderId + """, """ +
        interviewDateClause + """, """ +
        importantForTheRoleClause + """, """ +
        latestInterviewClause + """, """ +
        needForImprovementClause + """, """ +
        challengingQuestionsClause + """);"""

      Logger.info("InterviewTrainingOrderInfoDto.create():" + query)

      SQL(query).executeInsert()
    }
  }

  def update(orderInfo: InterviewTrainingOrderInfo) {
    DB.withConnection { implicit c =>
      val interviewDateClause = orderInfo.interviewDate match {
        case None => "NULL"
        case Some(interviewDate) => "'" + DbUtil.safetize(DbUtil.DateFormat.format(interviewDate)) + "'"
      }

      val importantForTheRoleClause = orderInfo.importantForTheRole match {
        case None => "NULL"
        case Some(importantForTheRole) => "'" + DbUtil.safetize(importantForTheRole) + "'"
      }

      val latestInterviewClause = orderInfo.latestInterview match {
        case None => "NULL"
        case Some(latestInterview) => "'" + DbUtil.safetize(latestInterview) + "'"
      }

      val needForImprovementClause = orderInfo.needForImprovement match {
        case None => "NULL"
        case Some(needForImprovement) => "'" + DbUtil.safetize(needForImprovement) + "'"
      }

      val challengingQuestionsClause = orderInfo.challengingQuestions match {
        case None => "NULL"
        case Some(challengingQuestions) => "'" + DbUtil.safetize(challengingQuestions) + "'"
      }

      val query = """
        update it_order_info set
        order_id = """ + orderInfo.orderId + """,
        interview_date = """ + interviewDateClause + """,
        important_for_the_role = """ + importantForTheRoleClause + """,
        latest_interview = """ + latestInterviewClause + """,
        need_for_improvement = """ + needForImprovementClause + """,
        challenging_questions = """ + challengingQuestionsClause + """
        where id = """ + orderInfo.id.get + """;"""

      Logger.info("InterviewTrainingOrderInfoDto.update():" + query)

      SQL(query).executeUpdate()
    }
  }

  def getOfOrderId(orderId: Long): Option[InterviewTrainingOrderInfo] = {
    DB.withConnection { implicit c =>
      val query = """
        select id, interview_date, important_for_the_role, latest_interview, need_for_improvement, challenging_questions
        from it_order_info
        where order_id = """ + orderId + """;"""

      Logger.info("InterviewTrainingOrderInfoDto.getOfOrderId():" + query)

      val rowParser = long("id") ~ (date("interview_date") ?) ~ (str("important_for_the_role") ?) ~ (str("latest_interview") ?) ~ (str("need_for_improvement") ?) ~ (str("challenging_questions") ?) map {
        case id ~ interviewDateOpt ~ importantForTheRoleOpt ~ latestInterviewOpt ~ needForImprovementOpt ~ challengingQuestionsOpt =>

          InterviewTrainingOrderInfo(
            id = Some(id),
            orderId = orderId,
            interviewDate = interviewDateOpt,
            importantForTheRole = importantForTheRoleOpt,
            latestInterview = latestInterviewOpt,
            needForImprovement = needForImprovementOpt,
            challengingQuestions = challengingQuestionsOpt
          )
      }

      SQL(query).as(rowParser.singleOpt)
    }
  }
}
