package db

import javax.inject.{Singleton, Inject}

import anorm.SqlParser._
import anorm._
import models.Account
import play.api.Logger
import play.api.db.Database
import play.api.libs.json.{JsNull, Json}

@Singleton
class AccountDto @Inject() (db: Database) {
  private val commonClause = """ tp in (""" + Account.typeRater + """, """ + Account.typeAdmin + """)
                                and id > 0 """

  def getOfId(id: Long): Option[Account] = {
    db.withConnection { implicit c =>
      val query = """
        select prenume, nume, email, linkedin_basic_profile_fields, registered_at, tp, lang
        from useri
        where""" + commonClause + """
          and id = """ + id + """;"""

      Logger.info("AccountDto.getOfId():" + query)

      val rowParser = (str("prenume") ?) ~ (str("nume") ?) ~ (str("email") ?) ~ str("linkedin_basic_profile_fields") ~ date("registered_at") ~ int("tp") ~ str("lang") map {
        case firstName ~ lastName ~ emailAddress ~ linkedinBasicProfile ~ creationDate ~ accountType ~ languageCode =>
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
            languageCode = languageCode,
            creationTimestamp = creationDate.getTime
          )
      }

      SQL(query).as(rowParser.singleOpt)
    }
  }

  def getOfEmailAndPassword(emailAddress: String, password: String): Option[Account] = {
    db.withConnection { implicit c =>
      val query = """
        select id, prenume, nume, linkedin_basic_profile_fields, registered_at, tp, lang
        from useri
        where""" + commonClause + """
          and email = '""" + DbUtil.safetize(emailAddress.toLowerCase) + """'
          and pass = password('""" + password + """')
        limit 1;"""

      // This log is commented since it displays the password
      // Logger.info("AccountDto.getOfEmailAndPassword():" + query)

      val rowParser = long("id") ~ (str("prenume") ?) ~ (str("nume") ?) ~ str("linkedin_basic_profile_fields") ~ date("registered_at") ~ int("tp") ~ str("lang") map {
        case id ~ firstName ~ lastName ~ linkedinBasicProfile ~ creationDate ~ accountType ~ languageCode =>
          val linkedinBasicProfileOpt = linkedinBasicProfile match {
            case "" => JsNull
            case otherString => Json.parse(otherString)
          }

          Account(
            id = id,
            firstName = firstName,
            lastName = lastName,
            emailAddress = Some(emailAddress),
            password = None,
            linkedinProfile = linkedinBasicProfileOpt,
            `type` = accountType,
            languageCode = languageCode,
            creationTimestamp = creationDate.getTime
          )
      }

      SQL(query).as(rowParser.singleOpt)
    }
  }
}
