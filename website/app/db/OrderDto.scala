package db

import java.util.Date

import anorm.SqlParser._
import anorm._
import models.frontend.{FrontendOrder, OrderReceivedFromFrontend}
import models.{Coupon, Edition, Order, Price}
import play.api.Logger
import play.api.Play.current
import play.api.db.DB
import services.{GlobalConfig, StringService}

object OrderDto {
  def createTemporary(order: OrderReceivedFromFrontend): Option[Long] = {
    DB.withConnection { implicit c =>
      val cvFileNameClause = order.cvFileName match {
        case None => ""
        case Some(fileName) => DbUtil.safetize(fileName)
      }

      val coverLetterFileNameClause = order.coverLetterFileName match {
        case None => ""
        case Some(fileName) => DbUtil.safetize(fileName)
      }

      val couponCodeClause = order.couponCode match {
        case None => ""
        case Some(code) => DbUtil.safetize(code)
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
      insert into documents(id, edition_id, file, file_cv, file_li, added_at, code, added_by, type, status, position, employer, job_ad_url, customer_comment, /* useful fields */
        li_url, hireability, open_application, score1, score2, score_avg, score1_cv, score2_cv, score_avg_cv, score1_li, score2_li, score_avg_li, transaction_id, response_code, payment_id, payment_client, payment_card_type, payment_card_holder, payment_last4, payment_error, custom_comment, custom_comment_cv, custom_comment_li, how_doing_text, in_progress_at, doc_review, free_test, lang) /* unused but required fields */
      values(""" + order.tempId + """, """ +
        order.editionId + """, '""" +
        coverLetterFileNameClause + """', '""" +
        cvFileNameClause + """',
        '',
        now(), '""" +
        couponCodeClause + """', """ +
        order.accountId.getOrElse(AccountDto.unknownUserId) + """, '""" +
        Order.getTypeForDb(order.containedProductCodes) + """', """ +
        Order.statusIdNotPaid + """, '""" +
        positionSoughtClause + """', '""" +
        employerSoughtClause + """', """ +
        jobAdUrlClause + """, """ +
        customerCommentClause + """,
        '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', 0, '', '', '', '', 0, '', '', '', '', '', 0, 0, 0, 'sw');"""

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

      val couponCodeClause = order.couponId match {
        case None => ""
        case Some(couponId) =>
          val coupon = CouponDto.getOfId(couponId).get
          DbUtil.safetize(coupon.code)
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
      insert into documents(edition_id, file, file_cv, file_li, added_at, code, added_by, type, status, position, employer, job_ad_url, customer_comment, /* useful fields */
        li_url, hireability, open_application, score1, score2, score_avg, score1_cv, score2_cv, score_avg_cv, score1_li, score2_li, score_avg_li, transaction_id, response_code, payment_id, payment_client, payment_card_type, payment_card_holder, payment_last4, payment_error, custom_comment, custom_comment_cv, custom_comment_li, how_doing_text, in_progress_at, doc_review, free_test, lang) /* unused but required fields */
      values(""" + order.editionId + """, '""" +
        coverLetterFileNameClause + """', '""" +
        cvFileNameClause + """',
        '', '""" +
        DbUtil.formatTimestampForInsertOrUpdate(order.creationTimestamp) + """', '""" +
        couponCodeClause + """', """ +
        order.accountId.getOrElse(AccountDto.unknownUserId) + """, '""" +
        Order.getTypeForDb(order.containedProductCodes) + """', """ +
        Order.statusIdNotPaid + """, '""" +
        positionSoughtClause + """', '""" +
        employerSoughtClause + """', """ +
        jobAdUrlClause + """, """ +
        customerCommentClause + """,
        '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', 0, '', '', '', '', 0, '', '', '', '', '', 0, 0, 0, 'sw');"""

      Logger.info("OrderDto.createFinalised():" + query)

      SQL(query).executeInsert()
    }
  }

  def update(order: Order) {
    DB.withConnection { implicit c =>
      val accountIdClause = order.accountId match {
        case None => ""
        case Some(accountId) => ", added_by = " + accountId
      }

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

      val positionSoughtClause = order.positionSought match {
        case None => ""
        case Some(positionSought) => ", position = '" + DbUtil.safetize(positionSought) + "'"
      }

      val employerSoughtClause = order.employerSought match {
        case None => ""
        case Some(employerSought) => ", employer = '" + DbUtil.safetize(employerSought) + "'"
      }

      val jobAdUrlClause = order.jobAdUrl match {
        case None => ""
        case Some(jobAdUrl) => ", job_ad_url = '" + DbUtil.safetize(jobAdUrl) + "'"
      }

      val customerCommentClause = order.customerComment match {
        case None => ""
        case Some(customerComment) => ", customer_comment = '" + DbUtil.safetize(customerComment) + "'"
      }

      val paymentDateClause = order.paymentTimestamp match {
        case None => ""
        case Some(paymentTimestamp) => ", paid_on = '" + DbUtil.dateFormat.format(new Date(paymentTimestamp)) + "'"
      }

      val query = """
        update documents set
        edition_id = """ + order.editionId + """,
        status = """ + order.status +
        accountIdClause +
        cvFileNameClause +
        coverLetterFileNameClause +
        linkedinProfileFileNameClause +
        positionSoughtClause +
        employerSoughtClause +
        jobAdUrlClause +
        customerCommentClause +
        paymentDateClause + """
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
        select file, file_cv, file_li, added_at, added_by, type, d.status, position, employer, job_ad_url, customer_comment, paid_on,
          e.id as edition_id, edition,
          c.id as coupon_id, c.name, tp, number_of_times, discount, discount_type, valid_date, campaign_name
        from documents d
          inner join product_edition e on e.id = d.edition_id
          left join codes c on c.name = d.code
        where d.id = """ + id + """;"""

      Logger.info("OrderDto.getOfIdForFrontend():" + query)

      val rowParser = str("file") ~ str("file_cv") ~ str("file_li") ~ date("added_at") ~ long("added_by") ~ str("type") ~ int("status") ~ str("position") ~ str("employer") ~ (str("job_ad_url") ?) ~ (str("customer_comment") ?) ~ (date("paid_on") ?) ~
        long("edition_id") ~ str("edition") ~
        (long("coupon_id") ?) ~ (str("name") ?) ~ (int("tp") ?) ~ (int("number_of_times") ?) ~ (int("discount") ?) ~ (str("discount_type") ?) ~ (date("valid_date") ?) ~ (str("campaign_name") ?) map {
        case coverLetterFileName ~ cvFileName ~ linkedinProfileFileName ~ creationDate ~ accountId ~ docTypes ~ status ~ positionSought ~ employerSought ~ jobAdUrlOpt ~ customerCommentOpt ~ paymentDateOpt ~
          editionId ~ editionCode ~
          couponIdOpt ~ couponCodeOpt ~ couponTypeOpt ~ couponMaxUseCountOpt ~ amountOpt ~ discountTypeOpt ~ expirationDateOpt ~ campaignNameOpt =>

          val coverLetterFileNameOpt = coverLetterFileName match {
            case "" => None
            case otherString => Order.getFileNameWithoutPrefix(Some(otherString))
          }

          val cvFileNameOpt = cvFileName match {
            case "" => None
            case otherString => Order.getFileNameWithoutPrefix(Some(otherString))
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
                  currencyCode = GlobalConfig.currencyCode
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
                maxUseCount = couponMaxUseCountOpt.get
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
            positionSought = positionSoughtOpt,
            employerSought = employerSoughtOpt,
            jobAdUrl = jobAdUrlOpt,
            customerComment = customerCommentOpt,
            accountId = accountIdOpt,
            status = status,
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
        select d.id as order_id, file, file_cv, file_li, added_at, type, d.status, position, employer, job_ad_url, customer_comment, paid_on,
          e.id as edition_id, edition,
          c.id as coupon_id, c.name, tp, number_of_times, discount, discount_type, valid_date, campaign_name
        from documents d
          inner join product_edition e on e.id = d.edition_id
          left join codes c on c.name = d.code
        where added_by = """ + accountId + """
        order by d.id desc;"""

      Logger.info("OrderDto.getOfAccountIdForFrontend():" + query)

      val rowParser = long("order_id") ~ str("file") ~ str("file_cv") ~ str("file_li") ~ date("added_at") ~ str("type") ~ int("status") ~ str("position") ~ str("employer") ~ (str("job_ad_url") ?) ~ (str("customer_comment") ?) ~ (date("paid_on") ?) ~
        long("edition_id") ~ str("edition") ~
        (long("coupon_id") ?) ~ (str("name") ?) ~ (int("tp") ?) ~ (int("number_of_times") ?) ~ (int("discount") ?) ~ (str("discount_type") ?) ~ (date("valid_date") ?) ~ (str("campaign_name") ?) map {
        case orderId ~ coverLetterFileName ~ cvFileName ~ linkedinProfileFileName ~ creationDate ~ docTypes ~ status ~ positionSought ~ employerSought ~ jobAdUrlOpt ~ customerCommentOpt ~ paymentDateOpt ~
          editionId ~ editionCode ~
          couponIdOpt ~ couponCodeOpt ~ couponTypeOpt ~ couponMaxUseCountOpt ~ amountOpt ~ discountTypeOpt ~ expirationDateOpt ~ campaignNameOpt =>

          val coverLetterFileNameOpt = coverLetterFileName match {
            case "" => None
            case otherString => Order.getFileNameWithoutPrefix(Some(otherString))
          }

          val cvFileNameOpt = cvFileName match {
            case "" => None
            case otherString => Order.getFileNameWithoutPrefix(Some(otherString))
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
                  currencyCode = GlobalConfig.currencyCode
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
                maxUseCount = couponMaxUseCountOpt.get
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
            customerComment = customerCommentOpt,
            accountId = Some(accountId),
            status = status,
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
        select d.id as order_id, file, file_cv, file_li, added_at, type, d.status, position, employer, job_ad_url, customer_comment, edition_id,
          c.id as coupon_id, c.name
        from documents d
         left join codes c on c.name = d.code
        where d.id > 0
          and added_by = """ + accountId + """
          and paid_on is null
        order by d.id desc
        limit 1;"""

      Logger.info("OrderDto.getMostRecentUnpaidOfAccountId():" + query)

      val rowParser = long("order_id") ~ str("file") ~ str("file_cv") ~ str("file_li") ~ date("added_at") ~ str("type") ~ int("status") ~ str("position") ~ str("employer") ~ (str("job_ad_url") ?) ~ (str("customer_comment") ?) ~ long("edition_id") ~
        (long("coupon_id") ?) ~ (str("name") ?) map {
        case orderId ~ coverLetterFileName ~ cvFileName ~ linkedinProfileFileName ~ creationDate ~ docTypes ~ status ~ positionSought ~ employerSought ~ jobAdUrlOpt ~ customerCommentOpt ~ editionId ~
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
            customerComment = customerCommentOpt,
            accountId = Some(accountId),
            status = status,
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

  def setTwoDaysAfterAssessmentDeliveredEmailSent(orderId: Long) {
    DB.withConnection { implicit c =>
      val query = """
        update documents set
        2days_after_assessment_delivered_email_sent = 1
        where id = """ + orderId + """;"""

      Logger.info("OrderDto.setTwoDaysAfterAssessmentDeliveredEmailSent():" + query)

      SQL(query).executeUpdate()
    }
  }
}
