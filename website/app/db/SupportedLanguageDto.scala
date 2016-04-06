package db

import anorm.SqlParser._
import anorm._
import models.SupportedLanguage
import play.api.Logger
import play.api.Play.current
import play.api.db.DB

import scala.util.control.Breaks._

object SupportedLanguageDto {
  val all = getAll

  def getOfCode(ietfCode: String): Option[SupportedLanguage] = {
    var result: Option[SupportedLanguage] = None

    breakable {
      for (supportedLanguage <- all) {
        if (supportedLanguage.ietfCode == ietfCode) {
          result = Some(supportedLanguage)
          break()
        }
      }
    }

    result
  }

  private def getAll: List[SupportedLanguage] = {
    DB.withConnection { implicit c =>
      val query = """
        select id, ietf_code, name
        from supported_language
        order by id;"""

      Logger.info("SupportedLanguageDto.getAll():" + query)

      val rowParser = long("id") ~ str("ietf_code") ~ str("name") map {
        case id ~ ietfCode ~ name =>
          SupportedLanguage(
            id = id,
            ietfCode = ietfCode,
            name = name
          )
      }

      SQL(query).as(rowParser.*)
    }
  }
}
