package db

import anorm.SqlParser._
import anorm._
import models.Account
import play.api.Logger
import play.api.Play.current
import play.api.db.DB
import play.api.libs.json.{JsNull, Json}

object AccountDto {
  val unknownUserId = 1053

  def getOfId(id: Long): Option[Account] = {
    DB.withConnection { implicit c =>
      val query = """
        select prenume, nume, email, linkedin_basic_profile_fields, registered_at, tp
        from useri
        where id = """ + id + """;"""

      Logger.info("AccountDto.getOfId():" + query)

      val rowParser = (str("prenume") ?) ~ (str("nume") ?) ~ (str("email") ?) ~ str("linkedin_basic_profile_fields") ~ date("registered_at") ~ int("tp") map {
        case firstName ~ lastName ~ emailAddress ~ linkedinBasicProfile ~ creationDate ~ accountType =>
          val linkedinBasicProfileOpt = linkedinBasicProfile match {
            case "" => JsNull
            case otherString => Json.parse(otherString)
          }

          Account(
            id = id,
            firstName = firstName,
            lastName = lastName,
            emailAddress = emailAddress,
            password = None,
            linkedinProfile = linkedinBasicProfileOpt,
            `type` = accountType,
            creationTimestamp = creationDate.getTime
          )
      }

      SQL(query).as(rowParser.singleOpt)
    }
  }
}
