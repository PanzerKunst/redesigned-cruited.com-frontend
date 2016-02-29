package db

import java.util.{Calendar, GregorianCalendar}

import anorm.SqlParser._
import anorm._
import com.fasterxml.jackson.core.JsonParseException
import models.{Account, Order}
import play.api.Logger
import play.api.Play.current
import play.api.db.DB
import play.api.libs.json.{JsNull, JsValue, Json}

object AccountDto {
  val unknownUserId = 1053

  def createTemporary(accountId: Long): Option[Long] = {
    DB.withConnection { implicit c =>
      val query = """
      insert into useri(id, registered_at, /* useful fields */
        tp, code, img, linkedin_id, old_shw, old_nume, old_pass, old_prenume, date, last_login, fpay_done_cv, fpay_done_li, linkedin_basic_profile_fields) /* unused but required fields */
      values(""" + accountId + """,
        now(), """ +
        Account.typeCustomer + """, '', '', '', 0, '', '', '', now(), now(), 0, 0, '');"""

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
        case jsValue =>
          val validJsValue = Account.getValidLinkedinProfileJson(jsValue)
          DbUtil.safetize(validJsValue.toString())
      }

      val query = """
      insert into useri(prenume, email, pass, registered_at, linkedin_basic_profile_fields, /* useful fields */
        tp, code, img, linkedin_id, old_shw, old_nume, old_pass, old_prenume, date, last_login, fpay_done_cv, fpay_done_li) /* unused but required fields */
      values('""" + DbUtil.safetize(firstName) + """', '""" +
        DbUtil.safetize(emailAddress) + """', """ +
        passwordClause + """,
        now(), '""" +
        linkedinProfileClause + """', """ +
        Account.typeCustomer + """, '', '', '', 0, '', '', '', now(), now(), 0, 0);"""

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
        case jsValue =>
          val validJsValue = Account.getValidLinkedinProfileJson(jsValue)
          ", linkedin_basic_profile_fields = '" + DbUtil.safetize(validJsValue.toString()) + "'"
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
      // Logger.info("AccountDto.update():" + query)

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

  def getOfEmailAddress(emailAddress: String): Option[Account] = {
    DB.withConnection { implicit c =>
      val query = """
        select id, prenume, nume, linkedin_basic_profile_fields, registered_at, tp, pass
        from useri
        where id > 0
          and email = '""" + DbUtil.safetize(emailAddress) + """'
        limit 1;"""

      // This log is commented since it displays the password
      //Logger.info("AccountDto.getOfEmailAddress():" + query)

      val rowParser = long("id") ~ (str("prenume") ?) ~ (str("nume") ?) ~ str("linkedin_basic_profile_fields") ~ date("registered_at") ~ int("tp") ~ (str("pass")?) map {
        case id ~ firstName ~ lastName ~ linkedinBasicProfile ~ creationDate ~ accountType ~ passwordOpt =>
          val linkedinBasicProfileOpt = linkedinBasicProfile match {
            case "" => JsNull
            case otherString => Json.parse(otherString)
          }

          Account(
            id = id,
            firstName = firstName,
            lastName = lastName,
            emailAddress = Some(emailAddress),
            password = passwordOpt,
            linkedinProfile = linkedinBasicProfileOpt,
            `type` = accountType,
            creationTimestamp = creationDate.getTime
          )
      }

      SQL(query).as(rowParser.singleOpt)
    }
  }

  def getOfLinkedinAccountId(linkedInAccountId: String): Option[Account] = {
    DB.withConnection { implicit c =>
      val query = """
        select id, prenume, nume, email, linkedin_basic_profile_fields, registered_at, tp
        from useri
        where id > 0
          and linkedin_basic_profile_fields like '%"id":"""" + DbUtil.safetize(linkedInAccountId) + """"%'
        limit 1;"""

      Logger.info("AccountDto.getOfLinkedinAccountId():" + query)

      val rowParser = long("id") ~ (str("prenume") ?) ~ (str("nume") ?) ~ (str("email") ?) ~ str("linkedin_basic_profile_fields") ~ date("registered_at") ~ int("tp") map {
        case id ~ firstName ~ lastName ~ emailAddress ~ linkedinBasicProfile ~ creationDate ~ accountType =>
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

  def getOfEmailAndPassword(emailAddress: String, password: String): Option[Account] = {
    DB.withConnection { implicit c =>
      val query = """
        select id, prenume, nume, linkedin_basic_profile_fields, registered_at, tp
        from useri
        where id > 0
          and email = '""" + DbUtil.safetize(emailAddress) + """'
          and pass = password('""" + password + """')
        limit 1;"""

      // This log is commented since it displays the password
      // Logger.info("AccountDto.getOfEmailAndPassword():" + query)

      val rowParser = long("id") ~ (str("prenume") ?) ~ (str("nume") ?) ~ str("linkedin_basic_profile_fields") ~ date("registered_at") ~ int("tp") map {
        case id ~ firstName ~ lastName ~ linkedinBasicProfile ~ creationDate ~ accountType =>
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
            creationTimestamp = creationDate.getTime
          )
      }

      SQL(query).as(rowParser.singleOpt)
    }
  }

  def getWhoNeedUnpaidOrderReminderEmail: List[(String, String, Long)] = {
    DB.withConnection { implicit c =>
      val cal = new GregorianCalendar()
      cal.add(Calendar.DATE, -1)
      val creationDateClause = """
        and added_at < '""" + DbUtil.dateFormat.format(cal.getTime) + """'"""

      val query = """
        select distinct email, prenume,
          max(d.id) as order_id
        from useri u
          inner join documents d on d.added_by = u.id
        where added_by = u.id
          and d.id > 0
          and d.status = """ + Order.statusIdNotPaid + """
          and 1day_email_sent = 0""" +
        creationDateClause + """
        group by email, prenume;"""

      // Commented because spams too much
      // Logger.info("AccountDto.getWhoNeedUnpaidOrderReminderEmail():" + query)

      val rowParser = str("email") ~ str("prenume") ~
        long("order_id") map {
        case emailAddress ~ firstName ~
          orderId => (emailAddress, firstName, orderId)
      }

      SQL(query).as(rowParser.*)
    }
  }

  def getWhoNeedTheTwoDaysAfterAssessmentDeliveredEmail: List[(String, String, Long)] = {
    DB.withConnection { implicit c =>
      val cal = new GregorianCalendar()
      cal.add(Calendar.DATE, -2)
      val assessmentCompletedDateClause = """
        and set_done_at < '""" + DbUtil.dateFormat.format(cal.getTime) + """'"""

      val query = """
        select distinct email, prenume,
          max(d.id) as order_id
        from useri u
          inner join documents d on d.added_by = u.id
        where d.id > 0
          and d.status = """ + Order.statusIdComplete + """
          and 2days_after_assessment_delivered_email_sent = 0""" +
        assessmentCompletedDateClause + """
        group by email, prenume;"""

      // Commented because spams too much
      // Logger.info("AccountDto.getWhoNeedTheTwoDayAfterAssessmentDeliveredEmail():" + query)

      val rowParser = str("email") ~ str("prenume") ~
        long("order_id") map {
        case emailAddress ~ firstName ~
          orderId => (emailAddress, firstName, orderId)
      }

      SQL(query).as(rowParser.*)
    }
  }

  def getIdsOfAccountsWithBothersomeCharactersInLinkedinProfile: List[Long] = {
    DB.withConnection { implicit c =>
      val query = """
        select id, linkedin_basic_profile_fields
        from useri;"""

      Logger.info("AccountDto.getIdsOfAccountsWithBothersomeCharactersInLinkedinProfile():" + query)

      val nonProbematicId = -1.toLong

      val rowParser = long("id") ~ str("linkedin_basic_profile_fields") map {
        case id ~ linkedinBasicProfile =>
          linkedinBasicProfile match {
            case "" => nonProbematicId
            case otherString =>
              try {
                Json.parse(otherString)
                nonProbematicId
              }
              catch {
                case jpe: JsonParseException => id
              }
          }
      }

      val allAccountIds = SQL(query).as(rowParser.*)

      allAccountIds filterNot {
        _ == nonProbematicId
      }
    }
  }

  def cleanLinkedinProfileOfIds(ids: List[Long]) {
    DB.withConnection { implicit c =>
      val query = """
        update useri set
        linkedin_basic_profile_fields = ''
        where id in (""" + ids.mkString(", ") + """);"""

      Logger.info("AccountDto.cleanLinkedinProfileOfId():" + query)

      SQL(query).executeUpdate()
    }
  }
}
