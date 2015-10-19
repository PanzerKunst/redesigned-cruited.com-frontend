package db

import java.util.Date

import anorm._
import models.Account
import play.api.Logger
import play.api.Play.current
import play.api.db.DB
import play.api.libs.json.{JsValue, Json}

object AccountDto {
  def create(emailAddress: String, password: Option[String], linkedinBasicProfile: Option[JsValue]): Option[Long] = {
    DB.withConnection { implicit c =>
      val passwordClause = password match {
        case None => "NULL"
        case Some(pass) => "'" + DbUtil.safetize(pass) + "'"
      }

      val linkedinAccountIdClause = linkedinBasicProfile match {
        case None => "NULL"
        case Some(basicProfile) =>
          val linkedinAccountId = (basicProfile \ "id").as[String]
          "'" + DbUtil.safetize(linkedinAccountId) + "'"
      }

      val linkedinBasicProfileClause = linkedinBasicProfile match {
        case None => "NULL"
        case Some(basicProfile) => "'" + basicProfile.toString + "'"
      }

      val query = """
      insert into useri(email, pass, linkedin_id, linkedin_basic_profile_fields, registered_at, /* useful fields */
        code, img, old_shw, old_nume, old_pass, old_prenume, date, last_login, fpay_done_cv, fpay_done_li) /* unused but required fields */
      values('""" + DbUtil.safetize(emailAddress) + """', """ +
        passwordClause + """, """ +
        linkedinAccountIdClause + """, """ +
        linkedinBasicProfileClause + """,
        now(),
        '', '', 0, '', '', '', now(), now(), 0, 0);"""

      Logger.info("AccountDto.create():" + query)

      SQL(query).executeInsert()
    }
  }

  def getOfId(accountId: Long): Option[Account] = {
    DB.withConnection { implicit c =>
      val query = """
        select email, linkedin_id, linkedin_basic_profile_fields, registered_at
        from useri
        where id = """ + accountId + """;"""

      Logger.info("AccountDto.getOfId():" + query)

      SQL(query).singleOpt() match {
        case None => None
        case Some(row) =>
          val linkedinBasicProfileOpt = row[Option[String]]("linkedin_basic_profile_fields") match {
            case None => None
            case Some(jsonString) => Some(Json.toJson(jsonString))
          }

          Some(
            Account(
              accountId,
              row[String]("email"),
              None,
              row[Option[String]]("linkedin_id"),
              linkedinBasicProfileOpt,
              row[Date]("registered_at").getTime
            )
          )
      }
    }
  }

  def getOfLinkedinAccountId(linkedInAccountId: String): Option[Account] = {
    DB.withConnection { implicit c =>
      val query = """
        select id, email, linkedin_basic_profile_fields, registered_at
        from useri
        where linkedin_id = '""" + linkedInAccountId + """';"""

      Logger.info("AccountDto.getOfLinkedinAccountId():" + query)

      SQL(query).singleOpt() match {
        case None => None
        case Some(row) =>
          val linkedinBasicProfileOpt = row[Option[String]]("linkedin_basic_profile_fields") match {
            case None => None
            case Some(jsonString) => Some(Json.toJson(jsonString))
          }

          Some(
            Account(
              row[Long]("id"),
              row[String]("email"),
              None,
              Some(linkedInAccountId),
              linkedinBasicProfileOpt,
              row[Date]("registered_at").getTime
            )
          )
      }
    }
  }
}
