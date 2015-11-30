package db

import anorm.SqlParser._
import anorm._
import models.Account
import play.api.Logger
import play.api.Play.current
import play.api.db.DB
import play.api.libs.json.{JsNull, JsValue, Json}

object AccountDto {
  def createTemporary(accountId: Long): Option[Long] = {
    DB.withConnection { implicit c =>
      val query = """
      insert into useri(id, registered_at, /* useful fields */
        code, img, linkedin_id, old_shw, old_nume, old_pass, old_prenume, date, last_login, fpay_done_cv, fpay_done_li, linkedin_basic_profile_fields) /* unused but required fields */
      values(""" + accountId + """,
        now(),
        '', '', '', 0, '', '', '', now(), now(), 0, 0, '');"""

      Logger.info("AccountDto.createTemporary():" + query)

      SQL(query).executeInsert()
    }
  }

  def create(emailAddress: String, firstName: String, password: Option[String], linkedinProfile: JsValue): Option[Long] = {
    DB.withConnection { implicit c =>
      val passwordClause = password match {
        case None => "NULL"
        case Some(pass) => "password('" + pass + "')"
      }

      val linkedinProfileClause = linkedinProfile match {
        case JsNull => ""
        case jsObject => DbUtil.safetize(jsObject.toString())
      }

      val query = """
      insert into useri(prenume, email, pass, registered_at, linkedin_basic_profile_fields, /* useful fields */
        code, img, linkedin_id, old_shw, old_nume, old_pass, old_prenume, date, last_login, fpay_done_cv, fpay_done_li) /* unused but required fields */
      values('""" + DbUtil.safetize(firstName) + """', '""" +
        DbUtil.safetize(emailAddress) + """', """ +
        passwordClause + """,
        now(),
        '""" + linkedinProfileClause + """',
        '', '', '', 0, '', '', '', now(), now(), 0, 0);"""

      // This log is commented since it displays the password
      // Logger.info("AccountDto.create():" + query)

      SQL(query).executeInsert()
    }
  }

  def update(account: Account) {
    DB.withConnection { implicit c =>
      val firstNameClause = account.firstName match {
        case None => ""
        case Some(firstName) => ", prenume = '" + DbUtil.safetize(firstName) + "'"
      }

      val lastNameClause = account.lastName match {
        case None => ""
        case Some(lastName) => ", nume = '" + DbUtil.safetize(lastName) + "'"
      }

      val passwordClause = account.password match {
        case None => ""
        case Some(pass) => ", pass = password('" + pass + "')"
      }

      val linkedinProfileClause = account.linkedinProfile match {
        case JsNull => ""
        case jsObject => ", linkedin_basic_profile_fields = '" + DbUtil.safetize(jsObject.toString()) + "'"
      }

      val query = """
        update useri set
        email = '""" + DbUtil.safetize(account.emailAddress.get) + """'""" +
        firstNameClause +
        lastNameClause +
        passwordClause +
        linkedinProfileClause + """
        where id = """ + account.id + """;"""

      // This log is commented since it displays the password
      // Logger.info("AccountDataDto.update():" + query)

      SQL(query).executeUpdate()
    }
  }

  def deleteOfId(id: Long) {
    DB.withConnection { implicit c =>
      val query = """
        delete from useri
        where id = """ + id + """;"""

      Logger.info("AccountDto.deleteOfId():" + query)

      SQL(query).execute()
    }
  }

  def getOfId(id: Long): Option[Account] = {
    DB.withConnection { implicit c =>
      val query = """
        select prenume, nume, email, linkedin_basic_profile_fields, registered_at
        from useri
        where id = """ + id + """;"""

      Logger.info("AccountDto.getOfId():" + query)

      val rowParser = (str("prenume") ?) ~ (str("nume") ?) ~ (str("email") ?) ~ str("linkedin_basic_profile_fields") ~ date("registered_at") map {
        case firstName ~ lastName ~ emailAddress ~ linkedinBasicProfile ~ creationDate =>
          val linkedinBasicProfileOpt = linkedinBasicProfile match {
            case "" => JsNull
            case otherString =>
              val readyToParse = otherString.replaceAll("\\n", "\\\\n") // Because there is a problem when Json.parse()ing the new lines contained in the summary
              Json.parse(readyToParse)
          }

          Account(
            id = id,
            firstName = firstName,
            lastName = lastName,
            emailAddress = emailAddress,
            password = None,
            linkedinProfile = linkedinBasicProfileOpt,
            creationTimestamp = creationDate.getTime
          )
      }

      SQL(query).as(rowParser.singleOpt)
    }
  }

  def getOfEmailAddress(emailAddress: String): Option[Account] = {
    DB.withConnection { implicit c =>
      val query = """
        select id, prenume, nume, linkedin_basic_profile_fields, registered_at
        from useri
        where id > 0
          and email = '""" + DbUtil.safetize(emailAddress) + """'
        limit 1;"""

      Logger.info("AccountDto.getOfEmailAddress():" + query)

      val rowParser = long("id") ~ (str("prenume") ?) ~ (str("nume") ?) ~ str("linkedin_basic_profile_fields") ~ date("registered_at") map {
        case id ~ firstName ~ lastName ~ linkedinBasicProfile ~ creationDate =>
          val linkedinBasicProfileOpt = linkedinBasicProfile match {
            case "" => JsNull
            case otherString =>
              val readyToParse = otherString.replaceAll("\\n", "\\\\n") // Because there is a problem when Json.parse()ing the new lines contained in the summary
              Json.parse(readyToParse)
          }

          Account(
            id = id,
            firstName = firstName,
            lastName = lastName,
            emailAddress = Some(emailAddress),
            password = None,
            linkedinProfile = linkedinBasicProfileOpt,
            creationTimestamp = creationDate.getTime
          )
      }

      SQL(query).as(rowParser.singleOpt)
    }
  }

  def getOfLinkedinAccountId(linkedInAccountId: String): Option[Account] = {
    DB.withConnection { implicit c =>
      val query = """
        select id, prenume, nume, email, linkedin_basic_profile_fields, registered_at
        from useri
        where id > 0
          and linkedin_basic_profile_fields like '%"id":"""" + DbUtil.safetize(linkedInAccountId) + """"%'
        limit 1;"""

      Logger.info("AccountDto.getOfLinkedinAccountId():" + query)

      val rowParser = long("id") ~ (str("prenume") ?) ~ (str("nume") ?) ~ (str("email") ?) ~ str("linkedin_basic_profile_fields") ~ date("registered_at") map {
        case id ~ firstName ~ lastName ~ emailAddress ~ linkedinBasicProfile ~ creationDate =>
          val linkedinBasicProfileOpt = linkedinBasicProfile match {
            case "" => JsNull
            case otherString =>
              val readyToParse = otherString.replaceAll("\\n", "\\\\n") // Because there is a problem when Json.parse()ing the new lines contained in the summary
              Json.parse(readyToParse)
          }

          Account(
            id = id,
            firstName = firstName,
            lastName = lastName,
            emailAddress = emailAddress,
            password = None,
            linkedinProfile = linkedinBasicProfileOpt,
            creationTimestamp = creationDate.getTime
          )
      }

      SQL(query).as(rowParser.singleOpt)
    }
  }

  def getOfEmailAndPassword(emailAddress: String, password: String): Option[Account] = {
    DB.withConnection { implicit c =>
      val query = """
        select id, prenume, nume, linkedin_basic_profile_fields, registered_at
        from useri
        where id > 0
          and email = '""" + DbUtil.safetize(emailAddress) + """'
          and pass = password('""" + password + """')
        limit 1;"""

      // This log is commented since it displays the password
      // Logger.info("AccountDto.getOfEmailAndPassword():" + query)

      val rowParser = long("id") ~ (str("prenume") ?) ~ (str("nume") ?) ~ str("linkedin_basic_profile_fields") ~ date("registered_at") map {
        case id ~ firstName ~ lastName ~ linkedinBasicProfile ~ creationDate =>
          val linkedinBasicProfileOpt = linkedinBasicProfile match {
            case "" => JsNull
            case otherString =>
              val readyToParse = otherString.replaceAll("\\n", "\\\\n") // Because there is a problem when Json.parse()ing the new lines contained in the summary
              Json.parse(readyToParse)
          }

          Account(
            id = id,
            firstName = firstName,
            lastName = lastName,
            emailAddress = Some(emailAddress),
            password = None,
            linkedinProfile = linkedinBasicProfileOpt,
            creationTimestamp = creationDate.getTime
          )
      }

      SQL(query).as(rowParser.singleOpt)
    }
  }
}
