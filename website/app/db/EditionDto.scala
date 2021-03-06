package db

import anorm.SqlParser._
import anorm._
import models.Edition
import play.api.Logger
import play.api.Play.current
import play.api.db.DB

import scala.util.control.Breaks._

object EditionDto {
  val All = getAll

  def getOfId(id: Long): Option[Edition] = {
    var result: Option[Edition] = None

    breakable {
      for (edition <- All) {
        if (edition.id == id) {
          result = Some(edition)
          break()
        }
      }
    }

    result
  }

  def getOfCode(code: String): Option[Edition] = {
    var result: Option[Edition] = None

    breakable {
      for (edition <- All) {
        if (edition.code == code) {
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

      val rowParser = long("id") ~ str("edition") map {
        case id ~ code =>
          Edition(
            id = id,
            code = code
          )
      }

      SQL(query).as(rowParser.*)
    }
  }
}
