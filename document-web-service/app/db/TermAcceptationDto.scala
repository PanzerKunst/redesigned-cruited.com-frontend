package db

import anorm._
import play.api.Logger
import play.api.Play.current
import play.api.db.DB

// TODO: delete when the new App pages are released
object TermAcceptationDto {
  def create(orderId: Long, userId: Long): Option[Long] = {
    DB.withConnection { implicit c =>
      val query = """
      insert into term_accceptation(userid, doc_id, type, status, date_time)
      values(""" + userId + """, """ +
        orderId + """,
        'Document',
        1,
        now());"""

      Logger.info("TermAcceptationDto.create():" + query)

      SQL(query).executeInsert()
    }
  }
}
