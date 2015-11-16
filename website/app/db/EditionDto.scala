package db

import anorm._
import models.Edition
import play.api.Logger
import play.api.Play.current
import play.api.db.DB

import scala.util.control.Breaks._

object EditionDto {
  val all = getAll

  def getOfId(id: Long): Option[Edition] = {
    var result: Option[Edition] = None

    breakable {
      for (edition <- all) {
        if (edition.id == id) {
          result = Some(edition)
          break()
        }
      }
    }

    result
  }

  private def getAll: List[Edition] = {
    DB.withConnection { implicit c =>
      val query = """
        select id, edition
        from product_edition
        order by id;"""

      Logger.info("EditionDto.getAll():" + query)

      SQL(query)().map { row =>
        Edition(
          id = row[Long]("id"),
          code = row[String]("edition")
        )
      }.toList
    }
  }
}
