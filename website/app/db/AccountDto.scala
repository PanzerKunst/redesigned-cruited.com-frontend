package db

import anorm.SqlParser._
import anorm._
import models.Account
import play.api.Logger
import play.api.Play.current
import play.api.db.DB
import play.api.libs.json.Json

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

  def create(emailAddress: String, firstName: String, password: Option[String]): Option[Long] = {
    DB.withConnection { implicit c =>
      val passwordClause = password match {
        case None => "NULL"
        case Some(pass) => "'" + DbUtil.safetize(pass) + "'"
      }

      val query = """
      insert into useri(prenume, email, pass, registered_at, /* useful fields */
        code, img, linkedin_id, old_shw, old_nume, old_pass, old_prenume, date, last_login, fpay_done_cv, fpay_done_li, linkedin_basic_profile_fields) /* unused but required fields */
      values('""" + DbUtil.safetize(firstName) + """', '""" +
        DbUtil.safetize(emailAddress) + """', """ +
        passwordClause + """,
        now(),
        '', '', '', 0, '', '', '', now(), now(), 0, 0, '');"""

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
        case Some(pass) => ", pass = '" + DbUtil.safetize(pass) + "'"
      }

      val pictureUrlClause = account.pictureUrl match {
        case None => ""
        case Some(pictureUrl) => ", img = '" + DbUtil.safetize(pictureUrl) + "'"
      }

      val linkedinAccountIdClause = account.linkedinAccountId match {
        case None => ""
        case Some(id) => ", linkedin_id = '" + DbUtil.safetize(id) + "'"
      }

      val linkedinBasicProfileClause = account.linkedinBasicProfile match {
        case None => ""
        case Some(basicProfile) => ", linkedin_basic_profile_fields = '" + basicProfile + "'"
      }

      val query = """
        update useri set
        email = '""" + DbUtil.safetize(account.emailAddress.get) + """'""" +
        firstNameClause +
        lastNameClause +
        passwordClause +
        pictureUrlClause +
        linkedinAccountIdClause +
        linkedinBasicProfileClause + """
        where id = """ + account.id + """;"""

      // This log is commented since it displays the password
      // Logger.info("AccountDataDto.update():" + query)

      SQL(query).executeUpdate()
    }
  }

  def deleteOfId(accountId: Long) {
    DB.withConnection { implicit c =>
      val query = """
        delete from useri
        where id = """ + accountId + """;"""

      Logger.info("AccountDto.deleteOfId():" + query)

      SQL(query).execute()
    }
  }

  def getOfId(accountId: Long): Option[Account] = {
    DB.withConnection { implicit c =>
      val query = """
        select prenume, nume, email, img, linkedin_id, linkedin_basic_profile_fields, registered_at
        from useri
        where id = """ + accountId + """;"""

      Logger.info("AccountDto.getOfId():" + query)

      val accountOptionRowParser = (str("prenume") ?) ~ (str("nume") ?) ~ (str("email") ?) ~ str("img") ~ str("linkedin_id") ~ str("linkedin_basic_profile_fields") ~ date("registered_at") map {
        case firstName ~ lastName ~ emailAddress ~ pictureUrl ~ linkedinAccountId ~ linkedinBasicProfile ~ creationDate =>
          val pictureUrlOpt = pictureUrl match {
            case "" => None
            case otherString => Some(otherString)
          }

          val linkedinAccountIdOpt = linkedinAccountId match {
            case "" => None
            case otherString => Some(otherString)
          }

          val linkedinBasicProfileOpt = linkedinBasicProfile match {
            case "" => None
            case otherString => Some(Json.toJson(otherString))
          }

          Account(
            id = accountId,
            firstName = firstName,
            lastName = lastName,
            emailAddress = emailAddress,
            password = None,
            pictureUrl = pictureUrlOpt,
            linkedinAccountId = linkedinAccountIdOpt,
            linkedinBasicProfile = linkedinBasicProfileOpt,
            creationTimestamp = creationDate.getTime
          )
      }

      SQL(query).as(accountOptionRowParser.singleOpt)
    }
  }

  def getOfEmailAddress(emailAddress: String): Option[Account] = {
    DB.withConnection { implicit c =>
      val query = """
        select id, prenume, nume, img, linkedin_id, linkedin_basic_profile_fields, registered_at
        from useri
        where email = '""" + DbUtil.safetize(emailAddress) + """'
        limit 1;"""

      Logger.info("AccountDto.getOfEmailAddress():" + query)

      val accountOptionRowParser = long("id") ~ (str("prenume") ?) ~ (str("nume") ?) ~ str("img") ~ str("linkedin_id") ~ str("linkedin_basic_profile_fields") ~ date("registered_at") map {
        case id ~ firstName ~ lastName ~ pictureUrl ~ linkedinAccountId ~ linkedinBasicProfile ~ creationDate =>
          val pictureUrlOpt = pictureUrl match {
            case "" => None
            case otherString => Some(otherString)
          }

          val linkedinAccountIdOpt = linkedinAccountId match {
            case "" => None
            case otherString => Some(otherString)
          }

          val linkedinBasicProfileOpt = linkedinBasicProfile match {
            case "" => None
            case otherString => Some(Json.toJson(otherString))
          }

          Account(
            id = id,
            firstName = firstName,
            lastName = lastName,
            emailAddress = Some(emailAddress),
            password = None,
            pictureUrl = pictureUrlOpt,
            linkedinAccountId = linkedinAccountIdOpt,
            linkedinBasicProfile = linkedinBasicProfileOpt,
            creationTimestamp = creationDate.getTime
          )
      }

      SQL(query).as(accountOptionRowParser.singleOpt)
    }
  }

  def getOfLinkedinAccountId(linkedInAccountId: String): Option[Account] = {
    DB.withConnection { implicit c =>
      val query = """
        select id, prenume, nume, email, img, linkedin_basic_profile_fields, registered_at
        from useri
        where linkedin_id = '""" + DbUtil.safetize(linkedInAccountId) + """'
        limit 1;"""

      Logger.info("AccountDto.getOfLinkedinAccountId():" + query)

      val accountOptionRowParser = long("id") ~ (str("prenume") ?) ~ (str("nume") ?) ~ (str("email") ?) ~ str("img") ~ str("linkedin_basic_profile_fields") ~ date("registered_at") map {
        case id ~ firstName ~ lastName ~ emailAddress ~ pictureUrl ~ linkedinBasicProfile ~ creationDate =>
          val pictureUrlOpt = pictureUrl match {
            case "" => None
            case otherString => Some(otherString)
          }

          val linkedinBasicProfileOpt = linkedinBasicProfile match {
            case "" => None
            case otherString => Some(Json.toJson(otherString))
          }

          Account(
            id = id,
            firstName = firstName,
            lastName = lastName,
            emailAddress = emailAddress,
            password = None,
            pictureUrl = pictureUrlOpt,
            linkedinAccountId = Some(linkedInAccountId),
            linkedinBasicProfile = linkedinBasicProfileOpt,
            creationTimestamp = creationDate.getTime
          )
      }

      SQL(query).as(accountOptionRowParser.singleOpt)
    }
  }
}
