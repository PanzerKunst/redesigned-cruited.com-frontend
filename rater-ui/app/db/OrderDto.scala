package db

import javax.inject.{Inject, Singleton}

import anorm.SqlParser._
import anorm._
import models._
import models.frontend.FrontendOrder
import play.api.Logger
import play.api.db.Database
import play.api.libs.json.{JsNull, Json}
import services.{GlobalConfig, StringService}

@Singleton
class OrderDto @Inject()(db: Database, couponDto: CouponDto, accountDto: AccountDto) {
  def update(order: Order) {
    db.withConnection { implicit c =>
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

      val couponCodeClause = order.couponId match {
        case None => ", code = NULL"
        case Some(couponId) =>
          val coupon = couponDto.getOfId(couponId).get
          ", code = '" + DbUtil.safetize(coupon.code) + "'"
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

      val query = """
        update documents set
        status = """ + order.status + """,
        added_by = """ + order.customer.id + """,
        paid_on = """ + order.paymentTimestamp +
        couponCodeClause +
        cvFileNameClause +
        coverLetterFileNameClause +
        linkedinProfileFileNameClause +
        positionSoughtClause +
        employerSoughtClause +
        jobAdUrlClause +
        customerCommentClause + """
        where id = """ + order.id.get + """;"""

      Logger.info("OrderDto.update():" + query)

      SQL(query).executeUpdate()
    }
  }

  def getOfId(id: Long): Option[Order] = {
    getOfIdForFrontend(id).map { tuple => new Order(tuple._1, tuple._2)}
  }

  // TODO: remove if unused
  def getOfIdForFrontend(id: Long): Option[(FrontendOrder, Option[String])] = {
    db.withConnection { implicit c =>
      val query = """
        select file, file_cv, file_li, added_at, type, d.status, position, employer, job_ad_url, customer_comment, paid_on, d.lang as order_lang,
          edition,
          u.id as customer_id, u.prenume as customer_first_name, u.nume as customer_last_name, u.email as customer_email, u.linkedin_basic_profile_fields as customer_li_fields, u.registered_at as customer_creation_date, u.tp as customer_account_type, u.lang as customer_lang,
          r.id as rater_id, r.prenume as rater_first_name, r.nume as rater_last_name, r.email as rater_email, r.linkedin_basic_profile_fields as rater_li_fields, r.registered_at as rater_creation_date, r.tp as rater_account_type, r.lang as rater_lang,
          c.id as coupon_id, c.name, c.tp as coupon_type, number_of_times, discount, discount_type, valid_date, campaign_name, error_message
        from documents d
          inner join product_edition e on e.id = d.edition_id
          inner join useri u on u.id = d.added_by
          left join useri r on r.id = d.assign_to
          left join codes c on c.name = d.code
        where d.shw = 1
          and u.id != """ + accountDto.unknownUserId + """
          and paid_on is not null
          and d.id = """ + id + """;"""

      Logger.info("OrderDto.getOfIdForFrontend():" + query)

      val rowParser = str("file") ~ str("file_cv") ~ str("file_li") ~ date("added_at") ~ str("type") ~ int("status") ~ str("position") ~ str("employer") ~ (str("job_ad_url") ?) ~ (str("customer_comment") ?) ~ date("paid_on") ~ str("order_lang") ~
        str("edition") ~
        long("customer_id") ~ str("customer_first_name") ~ (str("customer_last_name") ?) ~ str("customer_email") ~ str("customer_li_fields") ~ date("customer_creation_date") ~ int("customer_account_type") ~ str("customer_lang") ~
        (long("rater_id") ?) ~ (str("rater_first_name") ?) ~ (str("rater_last_name") ?) ~ (str("rater_email") ?) ~ (str("rater_li_fields") ?) ~ (date("rater_creation_date") ?) ~ (int("rater_account_type") ?) ~ (str("rater_lang") ?) ~
        (long("coupon_id") ?) ~ (str("name") ?) ~ (int("coupon_type") ?) ~ (int("number_of_times") ?) ~ (int("discount") ?) ~ (str("discount_type") ?) ~ (date("valid_date") ?) ~ (str("campaign_name") ?) ~ (str("error_message") ?) map {
        case coverLetterFileName ~ cvFileName ~ linkedinProfileFileName ~ orderCreationDate ~ docTypes ~ status ~ positionSought ~ employerSought ~ jobAdUrlOpt ~ customerCommentOpt ~ paymentDate ~ orderLanguageCode ~
          editionCode ~
          customerId ~ customerFirstName ~ customerLastNameOpt ~ customerEmail ~ customerLiFields ~ customerCreationDate ~ customerAccountType ~ customerLanguageCode ~
          raterIdOpt ~ raterFirstNameOpt ~ raterLastNameOpt ~ raterEmailOpt ~ raterLiFieldsOpt ~ raterCreationDateOpt ~ raterAccountTypeOpt ~ raterLanguageCodeOpt ~
          couponIdOpt ~ couponCodeOpt ~ couponTypeOpt ~ couponMaxUseCountOpt ~ amountOpt ~ discountTypeOpt ~ expirationDateOpt ~ campaignNameOpt ~ couponExpiredMsgOpt =>

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

          val customer = Account(
            id = customerId,
            firstName = customerFirstName,
            lastName = customerLastNameOpt,
            emailAddress = customerEmail,
            password = None,
            linkedinProfile = customerLiFields match {
              case "" => JsNull
              case otherString => Json.parse(otherString)
            },
            `type` = customerAccountType,
            languageCode = customerLanguageCode,
            creationTimestamp = customerCreationDate.getTime
          )

          val raterOpt = raterIdOpt match {
            case None => None
            case Some(raterId) => Some(Account(
              id = raterId,
              firstName = raterFirstNameOpt.get,
              lastName = raterLastNameOpt,
              emailAddress = raterEmailOpt.get,
              password = None,
              linkedinProfile = raterLiFieldsOpt match {
                case None => JsNull
                case Some(raterLiFields) => raterLiFields match {
                  case "" => JsNull
                  case otherString => Json.parse(otherString)
                }
              },
              `type` = raterAccountTypeOpt.get,
              languageCode = raterLanguageCodeOpt.get,
              creationTimestamp = raterCreationDateOpt.get.getTime
            ))
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

          val frontendOrder = FrontendOrder(
            id = id,
            idInBase64 = StringService.base64Encode(id.toString),
            tags = List(editionCode),
            containedProductCodes = Order.getContainedProductCodesFromTypesString(docTypes),
            coupon = couponOpt,
            cvFileName = cvFileNameOpt,
            coverLetterFileName = coverLetterFileNameOpt,
            positionSought = positionSoughtOpt,
            employerSought = employerSoughtOpt,
            jobAdUrl = jobAdUrlOpt,
            customerComment = customerCommentOpt,
            customer = customer,
            rater = raterOpt,
            status = status,
            languageCode = orderLanguageCode,
            creationTimestamp = orderCreationDate.getTime,
            paymentTimestamp = paymentDate.getTime
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

  def getOfRaterId(accountId: Long): List[Order] = {
    getOfRaterIdForFrontend(accountId).map { tuple => new Order(tuple._1, tuple._2)}
  }

  def getOfRaterIdForFrontend(accountId: Long): List[(FrontendOrder, Option[String])] = {
    db.withConnection { implicit c =>
      val query = """
        select d.id as order_id, file, file_cv, file_li, added_at, type, d.status, position, employer, job_ad_url, customer_comment, paid_on, d.lang as order_lang,
          edition,
          u.id as customer_id, u.prenume as customer_first_name, u.nume as customer_last_name, u.email as customer_email, u.linkedin_basic_profile_fields as customer_li_fields, u.registered_at as customer_creation_date, u.tp as customer_account_type, u.lang as customer_lang,
          r.prenume as rater_first_name, r.nume as rater_last_name, r.email as rater_email, r.linkedin_basic_profile_fields as rater_li_fields, r.registered_at as rater_creation_date, r.tp as rater_account_type, r.lang as rater_lang,
          c.id as coupon_id, c.name, c.tp as coupon_type, number_of_times, discount, discount_type, valid_date, campaign_name, error_message
        from documents d
          inner join product_edition e on e.id = d.edition_id
          inner join useri u on u.id = d.added_by
          inner join useri r on r.id = d.assign_to
          left join codes c on c.name = d.code
        where d.shw = 1
          and u.id != """ + accountDto.unknownUserId + """
          and paid_on is not null
          and r.id = """ + accountId + """
          and d.status in (""" + Order.statusIdPaid + """, """ + Order.statusIdInProgress + """, """ + Order.statusIdAwaitingFeedback + """)
        order by d.id desc;"""

      Logger.info("OrderDto.getOfRaterIdForFrontend():" + query)

      val rowParser = long("order_id") ~ str("file") ~ str("file_cv") ~ str("file_li") ~ date("added_at") ~ str("type") ~ int("status") ~ str("position") ~ str("employer") ~ (str("job_ad_url") ?) ~ (str("customer_comment") ?) ~ date("paid_on") ~ str("order_lang") ~
        str("edition") ~
        long("customer_id") ~ str("customer_first_name") ~ (str("customer_last_name") ?) ~ str("customer_email") ~ str("customer_li_fields") ~ date("customer_creation_date") ~ int("customer_account_type") ~ str("customer_lang") ~
        str("rater_first_name") ~ (str("rater_last_name") ?) ~ str("rater_email") ~ str("rater_li_fields") ~ date("rater_creation_date") ~ int("rater_account_type") ~ str("rater_lang") ~
        (long("coupon_id") ?) ~ (str("name") ?) ~ (int("coupon_type") ?) ~ (int("number_of_times") ?) ~ (int("discount") ?) ~ (str("discount_type") ?) ~ (date("valid_date") ?) ~ (str("campaign_name") ?) ~ (str("error_message") ?) map {
        case orderId ~ coverLetterFileName ~ cvFileName ~ linkedinProfileFileName ~ orderCreationDate ~ docTypes ~ status ~ positionSought ~ employerSought ~ jobAdUrlOpt ~ customerCommentOpt ~ paymentDate ~ orderLanguageCode ~
          editionCode ~
          customerId ~ customerFirstName ~ customerLastNameOpt ~ customerEmail ~ customerLiFields ~ customerCreationDate ~ customerAccountType ~ customerLanguageCode ~
          raterFirstName ~ raterLastNameOpt ~ raterEmail ~ raterLiFields ~ raterCreationDate ~ raterAccountType ~ raterLanguageCode ~
          couponIdOpt ~ couponCodeOpt ~ couponTypeOpt ~ couponMaxUseCountOpt ~ amountOpt ~ discountTypeOpt ~ expirationDateOpt ~ campaignNameOpt ~ couponExpiredMsgOpt =>

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

          val customer = Account(
            id = customerId,
            firstName = customerFirstName,
            lastName = customerLastNameOpt,
            emailAddress = customerEmail,
            password = None,
            linkedinProfile = customerLiFields match {
              case "" => JsNull
              case otherString => Json.parse(otherString)
            },
            `type` = customerAccountType,
            languageCode = customerLanguageCode,
            creationTimestamp = customerCreationDate.getTime
          )

          val rater = Account(
            id = accountId,
            firstName = raterFirstName,
            lastName = raterLastNameOpt,
            emailAddress = raterEmail,
            password = None,
            linkedinProfile = raterLiFields match {
              case "" => JsNull
              case otherString => Json.parse(otherString)
            },
            `type` = raterAccountType,
            languageCode = raterLanguageCode,
            creationTimestamp = raterCreationDate.getTime
          )

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

          val frontendOrder = FrontendOrder(
            id = orderId,
            idInBase64 = StringService.base64Encode(orderId.toString),
            tags = List(editionCode),
            containedProductCodes = Order.getContainedProductCodesFromTypesString(docTypes),
            coupon = couponOpt,
            cvFileName = cvFileNameOpt,
            coverLetterFileName = coverLetterFileNameOpt,
            positionSought = positionSoughtOpt,
            employerSought = employerSoughtOpt,
            jobAdUrl = jobAdUrlOpt,
            customerComment = customerCommentOpt,
            customer = customer,
            rater = Some(rater),
            status = status,
            languageCode = orderLanguageCode,
            creationTimestamp = orderCreationDate.getTime,
            paymentTimestamp = paymentDate.getTime
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
}
