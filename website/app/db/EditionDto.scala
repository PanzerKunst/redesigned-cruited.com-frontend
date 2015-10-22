package db

import anorm._
import models.Edition
import play.api.Logger
import play.api.Play.current
import play.api.db.DB

object EditionDto {
  val all = getAll

  private def getAll: List[Edition] = {
    DB.withConnection { implicit c =>
      val query = """
        select id, code
        from product_edition
        order by id;"""

      Logger.info("EditionDto.getAll():" + query)

      SQL(query)().map { row =>
        Edition(
          id = row[Long]("id"),
          code = row[String]("code")
        )
      }.toList
    }
  }
}
