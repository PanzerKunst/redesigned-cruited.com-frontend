package db

import java.util.{Calendar, GregorianCalendar}

import anorm.SqlParser._
import anorm._
import com.fasterxml.jackson.core.JsonParseException
import models.{Account, Order, SupportedLanguage}
import play.api.Logger
import play.api.Play.current
import play.api.db.DB
import play.api.libs.json.{JsNull, JsValue, Json}

object AccountDto {
  val unknownUserId = 1053

  def createTemporary(accountId: Long): Option[Long] = {
    DB.withConnection("users") { implicit c =>
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

  def create(emailAddress: String, firstName: String, password: Option[String], linkedinProfile: JsValue, currentLanguage: SupportedLanguage): Option[Long] = {
    DB.withConnection("users") { implicit c =>
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
      insert into useri(prenume, email, pass, registered_at, linkedin_basic_profile_fields, lang, /* useful fields */
        tp, code, img, linkedin_id, old_shw, old_nume, old_pass, old_prenume, date, last_login, fpay_done_cv, fpay_done_li) /* unused but required fields */
      values('""" + DbUtil.safetize(firstName) + """', '""" +
        DbUtil.safetize(emailAddress.toLowerCase) + """', """ +
        passwordClause + """,
        now(), '""" +
        linkedinProfileClause + """', '""" +
        currentLanguage.ietfCode + """', """ +
        Account.typeCustomer + """, '', '', '', 0, '', '', '', now(), now(), 0, 0);"""

      // This log is commented since it displays the password
      // Logger.info("AccountDto.create():" + query)

      SQL(query).executeInsert()
    }
  }

  def update(account: Account) {
    DB.withConnection("users") { implicit c =>
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
        email = '""" + DbUtil.safetize(account.emailAddress.get.toLowerCase) + """',
        lang = '""" + DbUtil.safetize(account.languageCode) + """'""" +
        firstNameClause +
        lastNameClause +
        passwordClause +
        linkedinProfileClause + """
        where id = """ + account.id + """;"""

      // Query without the password
      Logger.info("""AccountDto.update():
        update useri set
        email = '""" + DbUtil.safetize(account.emailAddress.get.toLowerCase) + """',
      lang = '""" + DbUtil.safetize(account.languageCode) + """'""" +
        firstNameClause +
        lastNameClause +
        linkedinProfileClause + """
      where id = """ + account.id + """;""")

      SQL(query).executeUpdate()
    }
  }

  def deleteOfId(id: Long) {
    DB.withConnection("users") { implicit c =>
      val query = """
        delete from useri
        where id = """ + id + """;"""

      Logger.info("AccountDto.deleteOfId():" + query)

      SQL(query).execute()
    }
  }

  def getOfId(id: Long): Option[Account] = {
    DB.withConnection("users") { implicit c =>
      val query = """
        select prenume, nume, email, linkedin_basic_profile_fields, registered_at, tp, lang
        from useri
        where shw = """ + Account.showActive + """
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

  def getOfEmailAddress(emailAddress: String): Option[Account] = {
    DB.withConnection("users") { implicit c =>
      val query = """
        select id, prenume, nume, linkedin_basic_profile_fields, registered_at, tp, lang, pass
        from useri
        where shw = """ + Account.showActive + """
          and id > 0
          and email = '""" + DbUtil.safetize(emailAddress.toLowerCase) + """'
        limit 1;"""

      // This log is commented since it displays the password
      //Logger.info("AccountDto.getOfEmailAddress():" + query)

      val rowParser = long("id") ~ (str("prenume") ?) ~ (str("nume") ?) ~ str("linkedin_basic_profile_fields") ~ date("registered_at") ~ int("tp") ~ str("lang") ~ (str("pass") ?) map {
        case id ~ firstName ~ lastName ~ linkedinBasicProfile ~ creationDate ~ accountType ~ languageCode ~ passwordOpt =>
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
            languageCode = languageCode,
            creationTimestamp = creationDate.getTime
          )
      }

      SQL(query).as(rowParser.singleOpt)
    }
  }

  def getOfLinkedinAccountId(linkedInAccountId: String): Option[Account] = {
    DB.withConnection("users") { implicit c =>
      val query = """
        select id, prenume, nume, email, linkedin_basic_profile_fields, registered_at, tp, lang
        from useri
        where shw = """ + Account.showActive + """
          and id > 0
          and linkedin_basic_profile_fields like '%"id":"""" + DbUtil.safetize(linkedInAccountId) + """"%'
        limit 1;"""

      Logger.info("AccountDto.getOfLinkedinAccountId():" + query)

      val rowParser = long("id") ~ (str("prenume") ?) ~ (str("nume") ?) ~ (str("email") ?) ~ str("linkedin_basic_profile_fields") ~ date("registered_at") ~ int("tp") ~ str("lang") map {
        case id ~ firstName ~ lastName ~ emailAddress ~ linkedinBasicProfile ~ creationDate ~ accountType ~ languageCode =>
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
    DB.withConnection("users") { implicit c =>
      val query = """
        select id, prenume, nume, linkedin_basic_profile_fields, registered_at, tp, lang
        from useri
        where shw = """ + Account.showActive + """
          and id > 0
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

  /**
   * @return List[(emailAddress, firstName, languageCode, orderId)]
   */
  def getWhoNeedUnpaidOrderReminderEmail: List[(String, String, String, Long)] = {
    val nonTempAccounts = getNonTemporary

    val listOfAccountIdAndLatestOrderId = DB.withConnection("users") { implicit c =>
      val accountIds = nonTempAccounts.map(_.id)

      val cal = new GregorianCalendar()
      cal.add(Calendar.DATE, -1)
      val creationDateClause = """
        and added_at < '""" + DbUtil.dateFormat.format(cal.getTime) + """'"""

      val query = """
        select added_by, max(id) as order_id
        from documents
        where shw = """ + Account.showActive + """
          and added_by in (""" + accountIds.mkString(", ") + """)
          and id > 0
          and status = """ + Order.statusIdNotPaid + """
          and 1day_email_sent = 0""" +
        creationDateClause + """
        group by added_by;"""

      // Commented because spams too much
      // Logger.info("AccountDto.getWhoNeedUnpaidOrderReminderEmail():" + query)

      val rowParser = long("added_by") ~ long("order_id") map {
        case accountId ~ orderId => (accountId, orderId)
      }

      SQL(query).as(rowParser.*)
    }

    listOfAccountIdAndLatestOrderId map { tuple =>
      val account = nonTempAccounts.find(_.id == tuple._1).get
      (account.emailAddress.get, account.firstName.get, account.languageCode, tuple._2)
    }
  }

  /**
   * @return List[(emailAddress, firstName, languageCode, orderId)]
   */
  def getWhoNeedTheTwoDaysAfterAssessmentDeliveredEmail: List[(String, String, String, Long)] = {
    val nonTempAccounts = getNonTemporary

    val listOfAccountIdAndLatestOrderId = DB.withConnection("users") { implicit c =>
      val accountIds = nonTempAccounts.map(_.id)

      val cal = new GregorianCalendar()
      cal.add(Calendar.DATE, -2)
      val assessmentCompletedDateClause = """
        and set_done_at < '""" + DbUtil.dateFormat.format(cal.getTime) + """'"""

      val query = """
        select added_by, max(id) as order_id
        from documents
        where  shw = """ + Account.showActive + """
          and added_by in (""" + accountIds.mkString(", ") + """)
          and id > 0
          and status = """ + Order.statusIdNotPaid + """
          and 2days_after_assessment_delivered_email_sent = 0""" +
        assessmentCompletedDateClause + """
        group by added_by;"""

      // Commented because spams too much
      // Logger.info("AccountDto.getWhoNeedTheTwoDaysAfterAssessmentDeliveredEmail():" + query)

      val rowParser = long("added_by") ~ long("order_id") map {
        case accountId ~ orderId => (accountId, orderId)
      }

      SQL(query).as(rowParser.*)
    }

    listOfAccountIdAndLatestOrderId map { tuple =>
      val account = nonTempAccounts.find(_.id == tuple._1).get
      (account.emailAddress.get, account.firstName.get, account.languageCode, tuple._2)
    }
  }

  def getIdsOfAccountsWithBothersomeCharactersInLinkedinProfile: List[Long] = {
    DB.withConnection("users") { implicit c =>
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
    DB.withConnection("users") { implicit c =>
      val query = """
        update useri set
        linkedin_basic_profile_fields = ''
        where id in (""" + ids.mkString(", ") + """);"""

      Logger.info("AccountDto.cleanLinkedinProfileOfId():" + query)

      SQL(query).executeUpdate()
    }
  }

  private def getNonTemporary: List[Account] = {
    DB.withConnection("users") { implicit c =>
      val query = """
        select distinct id, prenume, nume, email, linkedin_basic_profile_fields, registered_at, tp, lang
        from useri
        where shw = """ + Account.showActive + """
          and id > 0;"""

      // This log is commented since it spams too much
      // Logger.info("AccountDto.getNonTemporary():" + query)

      val rowParser = long("id") ~ (str("prenume") ?) ~ (str("nume") ?) ~ (str("email") ?) ~ str("linkedin_basic_profile_fields") ~ date("registered_at") ~ int("tp") ~ str("lang") map {
        case id ~ firstName ~ lastName ~ emailAddress ~ linkedinBasicProfile ~ creationDate ~ accountType ~ languageCode =>
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

      SQL(query).as(rowParser.*)
    }
  }
}
