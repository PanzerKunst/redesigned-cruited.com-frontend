package db

import java.util.Date

import anorm.SqlParser._
import anorm._
import models._
import models.frontend.{FrontendOrder, OrderReceivedFromFrontend}
import play.api.Logger
import play.api.Play.current
import play.api.db.DB
import services.{GlobalConfig, StringService}

object OrderDto {
  def createTemporary(order: OrderReceivedFromFrontend, language: SupportedLanguage): Option[Long] = {
    DB.withConnection { implicit c =>
      val cvFileNameClause = order.cvFileName match {
        case None => ""
        case Some(fileName) => order.tempId + Order.fileNamePrefixSeparator + DbUtil.safetize(fileName)
      }

      val coverLetterFileNameClause = order.coverLetterFileName match {
        case None => ""
        case Some(fileName) => order.tempId + Order.fileNamePrefixSeparator + DbUtil.safetize(fileName)
      }

      val linkedinProfileLanguageClause = order.linkedinProfileLanguage match {
        case None => "NULL"
        case Some(linkedinProfileLang) => "'" + DbUtil.safetize(linkedinProfileLang) + "'"
      }

      val jobAdFileNameClause = order.jobAdFileName match {
        case None => "NULL"
        case Some(fileName) => "'" + order.tempId + Order.fileNamePrefixSeparator + DbUtil.safetize(fileName) + "'"
      }

      val couponCodeClause = order.couponCode match {
        case None => "NULL"
        case Some(code) => "'" + DbUtil.safetize(code) + "'"
      }

      val positionSoughtClause = order.positionSought match {
        case None => ""
        case Some(positionSought) => DbUtil.safetize(positionSought)
      }

      val employerSoughtClause = order.employerSought match {
        case None => ""
        case Some(employerSought) => DbUtil.safetize(employerSought)
      }

      val jobAdUrlClause = order.jobAdUrl match {
        case None => "NULL"
        case Some(jobAdUrl) => "'" + DbUtil.safetize(jobAdUrl) + "'"
      }

      val customerCommentClause = order.customerComment match {
        case None => "NULL"
        case Some(customerComment) => "'" + DbUtil.safetize(customerComment) + "'"
      }

      val query = """
      insert into documents(id, edition_id, file, file_cv, file_li, li_profile_lang, job_ad_filename, added_at, code, added_by, type, status, position, employer, job_ad_url, customer_comment, lang, custom_comment, custom_comment_cv, custom_comment_li)
      values(""" + order.tempId + """, """ +
        order.editionId + """, '""" +
        coverLetterFileNameClause + """', '""" +
        cvFileNameClause + """',
        '', """ +
        linkedinProfileLanguageClause + """, """ +
        jobAdFileNameClause + """,
        now(), """ +
        couponCodeClause + """, """ +
        order.accountId.getOrElse(AccountDto.unknownUserId) + """, '""" +
        Order.getTypeForDb(order.containedProductCodes) + """', """ +
        Order.statusIdNotPaid + """, '""" +
        positionSoughtClause + """', '""" +
        employerSoughtClause + """', """ +
        jobAdUrlClause + """, """ +
        customerCommentClause + """, '""" +
        language.ietfCode + """',
        '',
        '',
        '');"""

      Logger.info("OrderDto.createTemporary():" + query)

      SQL(query).executeInsert()
    }
  }

  def createFinalised(order: Order): Option[Long] = {
    DB.withConnection { implicit c =>
      val cvFileNameClause = order.cvFileName match {
        case None => ""
        case Some(fileName) => order.id.get + Order.fileNamePrefixSeparator + DbUtil.safetize(fileName)
      }

      val coverLetterFileNameClause = order.coverLetterFileName match {
        case None => ""
        case Some(fileName) => order.id.get + Order.fileNamePrefixSeparator + DbUtil.safetize(fileName)
      }

      val linkedinProfileLanguageClause = order.linkedinProfileLanguage match {
        case None => "NULL"
        case Some(linkedinProfileLang) => "'" + DbUtil.safetize(linkedinProfileLang) + "'"
      }

      val jobAdFileNameClause = order.jobAdFileName match {
        case None => "NULL"
        case Some(jobAdFileName) => "'" + order.id.get + Order.fileNamePrefixSeparator + DbUtil.safetize(jobAdFileName) + "'"
      }

      val couponCodeClause = order.couponId match {
        case None => "NULL"
        case Some(couponId) =>
          val coupon = CouponDto.getOfId(couponId).get
          "'" + DbUtil.safetize(coupon.code) + "'"
      }

      val positionSoughtClause = order.positionSought match {
        case None => ""
        case Some(positionSought) => DbUtil.safetize(positionSought)
      }

      val employerSoughtClause = order.employerSought match {
        case None => ""
        case Some(employerSought) => DbUtil.safetize(employerSought)
      }

      val jobAdUrlClause = order.jobAdUrl match {
        case None => "NULL"
        case Some(jobAdUrl) => "'" + DbUtil.safetize(jobAdUrl) + "'"
      }

      val customerCommentClause = order.customerComment match {
        case None => "NULL"
        case Some(customerComment) => "'" + DbUtil.safetize(customerComment) + "'"
      }

      val paymentDateClause = order.paymentTimestamp match {
        case None => "NULL"
        case Some(paymentTimestamp) => "'" + DbUtil.dateFormat.format(new Date(paymentTimestamp)) + "'"
      }

      val query = """
      insert into documents(edition_id, file, file_cv, file_li, li_profile_lang, job_ad_filename, added_at, code, added_by, type, status, position, employer, job_ad_url, customer_comment, lang, paid_on, custom_comment, custom_comment_cv, custom_comment_li)
      values(""" + order.editionId + """, '""" +
        coverLetterFileNameClause + """', '""" +
        cvFileNameClause + """',
        '', """ +
        linkedinProfileLanguageClause + """, """ +
        jobAdFileNameClause + """, '""" +
        DbUtil.formatTimestampForInsertOrUpdate(order.creationTimestamp) + """', """ +
        couponCodeClause + """, """ +
        order.accountId.getOrElse(AccountDto.unknownUserId) + """, '""" +
        Order.getTypeForDb(order.containedProductCodes) + """', """ +
        order.status + """, '""" +
        positionSoughtClause + """', '""" +
        employerSoughtClause + """', """ +
        jobAdUrlClause + """, """ +
        customerCommentClause + """, '""" +
        order.languageCode + """', """ +
        paymentDateClause + """,
        '',
        '',
        '');"""

      Logger.info("OrderDto.createFinalised():" + query)

      SQL(query).executeInsert()
    }
  }

  def update(order: Order) {
    DB.withConnection { implicit c =>
      val couponCodeClause = order.couponId match {
        case None => "NULL"
        case Some(couponId) =>
          val coupon = CouponDto.getOfId(couponId).get
          "'" + DbUtil.safetize(coupon.code) + "'"
      }

      val positionSoughtClause = order.positionSought match {
        case None => ""
        case Some(positionSought) => DbUtil.safetize(positionSought)
      }

      val employerSoughtClause = order.employerSought match {
        case None => ""
        case Some(employerSought) => DbUtil.safetize(employerSought)
      }

      val jobAdUrlClause = order.jobAdUrl match {
        case None => "NULL"
        case Some(jobAdUrl) => "'" + DbUtil.safetize(jobAdUrl) + "'"
      }

      val customerCommentClause = order.customerComment match {
        case None => "NULL"
        case Some(customerComment) => "'" + DbUtil.safetize(customerComment) + "'"
      }

      val paymentDateClause = order.paymentTimestamp match {
        case None => "NULL"
        case Some(paymentTimestamp) => "'" + DbUtil.dateFormat.format(new Date(paymentTimestamp)) + "'"
      }


      /* For the next 4 clauses, we need to make sure that we don't remove the info from the DB when users update their
      order without re-inputting the files */

      val cvFileNameClause = order.cvFileName match {
        case None => ""
        case Some(fileName) => ", file_cv = '" + order.id.get + Order.fileNamePrefixSeparator + DbUtil.safetize(fileName) + "'"
      }

      val coverLetterFileNameClause = order.coverLetterFileName match {
        case None => ""
        case Some(fileName) => ", file = '" + order.id.get + Order.fileNamePrefixSeparator + DbUtil.safetize(fileName) + "'"
      }

      val linkedinProfileFileNameClause = order.linkedinProfileFileName match {
        case None => ""
        case Some(fileName) => ", file_li = '" + order.id.get + Order.fileNamePrefixSeparator + DbUtil.safetize(fileName) + "'"
      }

      val jobAdFileNameClause = order.jobAdFileName match {
        case None => ""
        case Some(fileName) => ", job_ad_filename = '" + order.id.get + Order.fileNamePrefixSeparator + DbUtil.safetize(fileName) + "'"
      }

      val query = """
        update documents set
        edition_id = """ + order.editionId + """,
        status = """ + order.status + """,
        added_by = """ + order.accountId.getOrElse(AccountDto.unknownUserId) + """,
        code = """ + couponCodeClause + """,
        position = '""" + positionSoughtClause + """',
        employer = '""" + employerSoughtClause + """',
        job_ad_url = """ + jobAdUrlClause + """,
        customer_comment = """ + customerCommentClause + """,
        paid_on = """ + paymentDateClause +
        cvFileNameClause +
        coverLetterFileNameClause +
        linkedinProfileFileNameClause +
        jobAdFileNameClause + """
        where id = """ + order.id.get + """;"""

      Logger.info("OrderDto.update():" + query)

      SQL(query).executeUpdate()
    }
  }

  def deleteOfId(id: Long) {
    DB.withConnection { implicit c =>
      val query = """
        delete from documents
        where id = """ + id + """;"""

      Logger.info("OrderDto.deleteOfId():" + query)

      SQL(query).execute()
    }
  }

  def getOfId(id: Long): Option[Order] = {
    getOfIdForFrontend(id).map { tuple => new Order(tuple._1, tuple._2)}
  }

  def getOfIdForFrontend(id: Long): Option[(FrontendOrder, Option[String])] = {
    DB.withConnection { implicit c =>
      val query = """
        select file, file_cv, file_li, li_profile_lang, job_ad_filename, added_at, added_by, type, d.status, position, employer, job_ad_url, customer_comment, paid_on, lang,
          e.id as edition_id, edition,
          c.id as coupon_id, c.name, tp, number_of_times, discount, discount_type, valid_date, campaign_name, error_message
        from documents d
          inner join product_edition e on e.id = d.edition_id
          left join codes c on c.name = d.code
        where d.id = """ + id + """
          and d.shw = 1;"""

      Logger.info("OrderDto.getOfIdForFrontend():" + query)

      val rowParser = str("file") ~ str("file_cv") ~ str("file_li") ~ (str("li_profile_lang") ?) ~ (str("job_ad_filename") ?) ~ date("added_at") ~ long("added_by") ~ str("type") ~ int("status") ~ str("position") ~ str("employer") ~ (str("job_ad_url") ?) ~ (str("customer_comment") ?) ~ (date("paid_on") ?) ~ str("lang") ~
        long("edition_id") ~ str("edition") ~
        (long("coupon_id") ?) ~ (str("name") ?) ~ (int("tp") ?) ~ (int("number_of_times") ?) ~ (int("discount") ?) ~ (str("discount_type") ?) ~ (date("valid_date") ?) ~ (str("campaign_name") ?) ~ (str("error_message") ?) map {
        case coverLetterFileName ~ cvFileName ~ linkedinProfileFileName ~ liProfileLangOpt ~ jobAdFileNameOpt ~ creationDate ~ accountId ~ docTypes ~ status ~ positionSought ~ employerSought ~ jobAdUrlOpt ~ customerCommentOpt ~ paymentDateOpt ~ languageCode ~
          editionId ~ editionCode ~
          couponIdOpt ~ couponCodeOpt ~ couponTypeOpt ~ couponMaxUseCountOpt ~ amountOpt ~ discountTypeOpt ~ expirationDateOpt ~ campaignNameOpt ~ couponExpiredMsgOpt =>

          val coverLetterFileNameOpt = coverLetterFileName match {
            case "" => None
            case otherString => Order.getFileNameWithoutPrefix(Some(otherString))
          }

          val cvFileNameOpt = cvFileName match {
            case "" => None
            case otherString => Order.getFileNameWithoutPrefix(Some(otherString))
          }

          val jobAdFileNameOption = jobAdFileNameOpt match {
            case None => None
            case Some(jobAdFileName) => Order.getFileNameWithoutPrefix(Some(jobAdFileName))
          }

          val accountIdOpt = accountId match {
            case AccountDto.unknownUserId => None
            case otherNb => Some(otherNb)
          }

          val positionSoughtOpt = positionSought match {
            case "" => None
            case otherString => Some(otherString)
          }

          val employerSoughtOpt = employerSought match {
            case "" => None
            case otherString => Some(otherString)
          }

          val couponOpt = couponIdOpt match {
            case None => None
            case Some(couponId) =>
              val (discountPercentageOpt, discountPriceOpt) = discountTypeOpt.get match {
                case "by_percent" => (amountOpt, None)
                case "by_value" => (None, Some(Price(
                  amount = amountOpt.get,
                  currencyCode = GlobalConfig.paymentCurrencyCode
                )))
              }

              Some(Coupon(
                id = couponId,
                code = couponCodeOpt.get,
                campaignName = campaignNameOpt.get,
                expirationTimestamp = expirationDateOpt.get.getTime,
                discountPercentage = discountPercentageOpt,
                discountPrice = discountPriceOpt,
                `type` = couponTypeOpt.get,
                maxUseCount = couponMaxUseCountOpt.get,
                couponExpiredMsg = couponExpiredMsgOpt
              ))
          }

          val paymentTimestampOpt = paymentDateOpt match {
            case None => None
            case Some(paymentDate) => Some(paymentDate.getTime)
          }

          val frontendOrder = FrontendOrder(
            id = id,
            idInBase64 = StringService.base64Encode(id.toString),
            edition = Edition(
              id = editionId,
              code = editionCode
            ),
            containedProductCodes = Order.getContainedProductCodesFromTypesString(docTypes),
            coupon = couponOpt,
            cvFileName = cvFileNameOpt,
            coverLetterFileName = coverLetterFileNameOpt,
            linkedinProfileLanguage = liProfileLangOpt,
            positionSought = positionSoughtOpt,
            employerSought = employerSoughtOpt,
            jobAdUrl = jobAdUrlOpt,
            jobAdFileName = jobAdFileNameOption,
            customerComment = customerCommentOpt,
            accountId = accountIdOpt,
            status = status,
            languageCode = languageCode,
            creationTimestamp = creationDate.getTime,
            paymentTimestamp = paymentTimestampOpt
          )

          val linkedinProfileFileNameOpt = linkedinProfileFileName match {
            case "" => None
            case otherString => Order.getFileNameWithoutPrefix(Some(otherString))
          }

          (frontendOrder, linkedinProfileFileNameOpt)
      }

      SQL(query).as(rowParser.singleOpt)
    }
  }

  def getOfAccountId(accountId: Long): List[Order] = {
    getOfAccountIdForFrontend(accountId).map { tuple => new Order(tuple._1, tuple._2)}
  }

  def getOfAccountIdForFrontend(accountId: Long): List[(FrontendOrder, Option[String])] = {
    DB.withConnection { implicit c =>
      val query = """
        select d.id as order_id, file, file_cv, file_li, li_profile_lang, job_ad_filename, added_at, type, d.status, position, employer, job_ad_url, customer_comment, paid_on, lang,
          e.id as edition_id, edition,
          c.id as coupon_id, c.name, tp, number_of_times, discount, discount_type, valid_date, campaign_name, error_message
        from documents d
          inner join product_edition e on e.id = d.edition_id
          left join codes c on c.name = d.code
        where added_by = """ + accountId + """
          and d.shw = 1
        order by d.id desc;"""

      Logger.info("OrderDto.getOfAccountIdForFrontend():" + query)

      val rowParser = long("order_id") ~ str("file") ~ str("file_cv") ~ str("file_li") ~ (str("li_profile_lang") ?) ~ (str("job_ad_filename") ?) ~ date("added_at") ~ str("type") ~ int("status") ~ str("position") ~ str("employer") ~ (str("job_ad_url") ?) ~ (str("customer_comment") ?) ~ (date("paid_on") ?) ~ str("lang") ~
        long("edition_id") ~ str("edition") ~
        (long("coupon_id") ?) ~ (str("name") ?) ~ (int("tp") ?) ~ (int("number_of_times") ?) ~ (int("discount") ?) ~ (str("discount_type") ?) ~ (date("valid_date") ?) ~ (str("campaign_name") ?) ~ (str("error_message") ?) map {
        case orderId ~ coverLetterFileName ~ cvFileName ~ linkedinProfileFileName ~ liProfileLangOpt ~ jobAdFileNameOpt ~ creationDate ~ docTypes ~ status ~ positionSought ~ employerSought ~ jobAdUrlOpt ~ customerCommentOpt ~ paymentDateOpt ~ languageCode ~
          editionId ~ editionCode ~
          couponIdOpt ~ couponCodeOpt ~ couponTypeOpt ~ couponMaxUseCountOpt ~ amountOpt ~ discountTypeOpt ~ expirationDateOpt ~ campaignNameOpt ~ couponExpiredMsgOpt =>

          val coverLetterFileNameOpt = coverLetterFileName match {
            case "" => None
            case otherString => Order.getFileNameWithoutPrefix(Some(otherString))
          }

          val cvFileNameOpt = cvFileName match {
            case "" => None
            case otherString => Order.getFileNameWithoutPrefix(Some(otherString))
          }

          val jobAdFileNameOption = jobAdFileNameOpt match {
            case None => None
            case Some(jobAdFileName) => Order.getFileNameWithoutPrefix(Some(jobAdFileName))
          }

          val positionSoughtOpt = positionSought match {
            case "" => None
            case otherString => Some(otherString)
          }

          val employerSoughtOpt = employerSought match {
            case "" => None
            case otherString => Some(otherString)
          }

          val couponOpt = couponIdOpt match {
            case None => None
            case Some(couponId) =>
              val (discountPercentageOpt, discountPriceOpt) = discountTypeOpt.get match {
                case "by_percent" => (amountOpt, None)
                case "by_value" => (None, Some(Price(
                  amount = amountOpt.get,
                  currencyCode = GlobalConfig.paymentCurrencyCode
                )))
              }

              Some(Coupon(
                id = couponId,
                code = couponCodeOpt.get,
                campaignName = campaignNameOpt.get,
                expirationTimestamp = expirationDateOpt.get.getTime,
                discountPercentage = discountPercentageOpt,
                discountPrice = discountPriceOpt,
                `type` = couponTypeOpt.get,
                maxUseCount = couponMaxUseCountOpt.get,
                couponExpiredMsg = couponExpiredMsgOpt
              ))
          }

          val paymentTimestampOpt = paymentDateOpt match {
            case None => None
            case Some(paymentDate) => Some(paymentDate.getTime)
          }

          val frontendOrder = FrontendOrder(
            id = orderId,
            idInBase64 = StringService.base64Encode(orderId.toString),
            edition = Edition(
              id = editionId,
              code = editionCode
            ),
            containedProductCodes = Order.getContainedProductCodesFromTypesString(docTypes),
            coupon = couponOpt,
            cvFileName = cvFileNameOpt,
            coverLetterFileName = coverLetterFileNameOpt,
            positionSought = positionSoughtOpt,
            employerSought = employerSoughtOpt,
            jobAdUrl = jobAdUrlOpt,
            jobAdFileName = jobAdFileNameOption,
            linkedinProfileLanguage = liProfileLangOpt,
            customerComment = customerCommentOpt,
            accountId = Some(accountId),
            status = status,
            languageCode = languageCode,
            creationTimestamp = creationDate.getTime,
            paymentTimestamp = paymentTimestampOpt
          )

          val linkedinProfileFileNameOpt = linkedinProfileFileName match {
            case "" => None
            case otherString => Order.getFileNameWithoutPrefix(Some(otherString))
          }

          (frontendOrder, linkedinProfileFileNameOpt)
      }

      SQL(query).as(rowParser.*)
    }
  }

  def getMostRecentUnpaidOfAccountId(accountId: Long): Option[Order] = {
    DB.withConnection { implicit c =>
      val query = """
        select d.id as order_id, file, file_cv, file_li, li_profile_lang, job_ad_filename, added_at, type, d.status, position, employer, job_ad_url, customer_comment, edition_id, lang,
          c.id as coupon_id, c.name
        from documents d
          left join codes c on c.name = d.code
        where d.id > 0
          and added_by = """ + accountId + """
          and paid_on is null
          and d.shw = 1
        order by d.id desc
        limit 1;"""

      Logger.info("OrderDto.getMostRecentUnpaidOfAccountId():" + query)

      val rowParser = long("order_id") ~ str("file") ~ str("file_cv") ~ str("file_li") ~ (str("li_profile_lang") ?) ~ (str("job_ad_filename") ?) ~ date("added_at") ~ str("type") ~ int("status") ~ str("position") ~ str("employer") ~ (str("job_ad_url") ?) ~ (str("customer_comment") ?) ~ long("edition_id") ~ str("lang") ~
        (long("coupon_id") ?) ~ (str("name") ?) map {
        case orderId ~ coverLetterFileName ~ cvFileName ~ linkedinProfileFileName ~ liProfileLangOpt ~ jobAdFileNameOpt ~ creationDate ~ docTypes ~ status ~ positionSought ~ employerSought ~ jobAdUrlOpt ~ customerCommentOpt ~ editionId ~ languageCode ~
          couponIdOpt ~ couponCodeOpt =>

          val coverLetterFileNameOpt = coverLetterFileName match {
            case "" => None
            case otherString => Order.getFileNameWithoutPrefix(Some(otherString))
          }

          val cvFileNameOpt = cvFileName match {
            case "" => None
            case otherString => Order.getFileNameWithoutPrefix(Some(otherString))
          }

          val linkedinProfileFileNameOpt = linkedinProfileFileName match {
            case "" => None
            case otherString => Order.getFileNameWithoutPrefix(Some(otherString))
          }

          val jobAdFileNameOption = jobAdFileNameOpt match {
            case None => None
            case Some(jobAdFileName) => Order.getFileNameWithoutPrefix(Some(jobAdFileName))
          }

          val positionSoughtOpt = positionSought match {
            case "" => None
            case otherString => Some(otherString)
          }

          val employerSoughtOpt = employerSought match {
            case "" => None
            case otherString => Some(otherString)
          }

          Order(
            id = Some(orderId),
            editionId = editionId,
            containedProductCodes = Order.getContainedProductCodesFromTypesString(docTypes),
            couponId = couponIdOpt,
            cvFileName = cvFileNameOpt,
            coverLetterFileName = coverLetterFileNameOpt,
            linkedinProfileFileName = linkedinProfileFileNameOpt,
            positionSought = positionSoughtOpt,
            employerSought = employerSoughtOpt,
            jobAdUrl = jobAdUrlOpt,
            jobAdFileName = jobAdFileNameOption,
            linkedinProfileLanguage = liProfileLangOpt,
            customerComment = customerCommentOpt,
            accountId = Some(accountId),
            status = status,
            languageCode = languageCode,
            creationTimestamp = creationDate.getTime,
            paymentTimestamp = None
          )
      }

      SQL(query).as(rowParser.singleOpt)
    }
  }

  def setUnpaidOrderReminderEmailSent(orderId: Long) {
    DB.withConnection { implicit c =>
      val query = """
        update documents set
        1day_email_sent = 1
        where id = """ + orderId + """;"""

      Logger.info("OrderDto.setUnpaidOrderReminderEmailSent():" + query)

      SQL(query).executeUpdate()
    }
  }
}
