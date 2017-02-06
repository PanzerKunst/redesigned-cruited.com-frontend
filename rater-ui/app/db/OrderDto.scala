package db

import java.util.{Calendar, Date}
import javax.inject.{Inject, Singleton}

import anorm._
import models._
import models.frontend.FrontendOrder
import play.api.Logger
import play.api.db.Database
import play.api.libs.json.{JsNull, Json}
import services.{GlobalConfig, StringService}

import scala.collection.mutable.ListBuffer

@Singleton
class OrderDto @Inject()(db: Database, couponDto: CouponDto, accountDto: AccountDto, config: GlobalConfig) {
  var dueOrders: List[FrontendOrder] = List()
  var ordersSentToTheCustomer: List[FrontendOrder] = List()
  var ordersToDo: List[FrontendOrder] = List()

  private val commonClause = """ d.id > 0
    and d.shw = 1
    and u.id != """ + accountDto.unknownUserId + """
    and paid_on is not null"""

  def update(order: Order) {
    db.withConnection { implicit c =>
      val assignClause = order.rater match {
        case None => ""
        case Some(rater) => """,
          assign_to = """ + rater.id
      }

      val query = """
        update documents set
          status = """ + order.status +
        assignClause + """
        where id = """ + order.id + """;"""

      Logger.info("OrderDto.update():" + query)

      SQL(query).executeUpdate()
    }
  }

  def updateAsDeleted(id: Long) {
    db.withConnection { implicit c =>
      val query = """
        update documents set
          shw = """ + Order.showIdDeleted + """
        where id = """ + id + """;"""

      Logger.info("OrderDto.updateAsDeleted():" + query)

      SQL(query).executeUpdate()
    }
  }

  def getOfId(id: Long): Option[FrontendOrder] = {
    val query = """
      select d.id as order_id, file, file_cv, file_li, added_at, type, d.status, position, employer, job_ad_url, job_ad_filename, customer_comment, paid_on, d.lang as order_lang,
        edition,
        u.id as customer_id, u.prenume as customer_first_name, u.nume as customer_last_name, u.email as customer_email, u.linkedin_basic_profile_fields as customer_li_fields, u.registered_at as customer_creation_date, u.tp as customer_account_type, u.lang as customer_lang,
        r.id as rater_id, r.prenume as rater_first_name, r.nume as rater_last_name, r.email as rater_email, r.linkedin_basic_profile_fields as rater_li_fields, r.registered_at as rater_creation_date, r.tp as rater_account_type, r.lang as rater_lang,
        c.id as coupon_id, c.name, c.tp as coupon_type, number_of_times, discount, discount_type, valid_date, campaign_name, error_message
      from documents d
        inner join product_edition e on e.id = d.edition_id
        inner join useri u on u.id = d.added_by
        left join useri r on r.id = d.assign_to
        left join codes c on c.name = d.code
      where """ + commonClause + """
        and d.id = """ + id + """;"""

    Logger.info("OrderDto.get():" + query)

    processQuerySingle(query)
  }

  def getActionableOrdersOfRaterId(accountId: Long): List[FrontendOrder] = {
    val query = """
      select d.id as order_id, file, file_cv, file_li, added_at, type, d.status, position, employer, job_ad_url, job_ad_filename, customer_comment, paid_on, d.lang as order_lang,
        edition,
        u.id as customer_id, u.prenume as customer_first_name, u.nume as customer_last_name, u.email as customer_email, u.linkedin_basic_profile_fields as customer_li_fields, u.registered_at as customer_creation_date, u.tp as customer_account_type, u.lang as customer_lang,
        r.id as rater_id, r.prenume as rater_first_name, r.nume as rater_last_name, r.email as rater_email, r.linkedin_basic_profile_fields as rater_li_fields, r.registered_at as rater_creation_date, r.tp as rater_account_type, r.lang as rater_lang,
        c.id as coupon_id, c.name, c.tp as coupon_type, number_of_times, discount, discount_type, valid_date, campaign_name, error_message
      from documents d
        inner join product_edition e on e.id = d.edition_id
        inner join useri u on u.id = d.added_by
        inner join useri r on r.id = d.assign_to
        left join codes c on c.name = d.code
      where """ + commonClause + """
        and assign_to = """ + accountId + """
        and d.status in (""" + Order.statusIdPaid + """, """ + Order.statusIdInProgress + """)
      order by d.id desc;"""

    Logger.info("OrderDto.getActionableOrdersOfRaterId():" + query)

    processQuery(query)
  }

  def getOrdersAwaitingFeedback: List[FrontendOrder] = {
    val query = """
      select d.id as order_id, file, file_cv, file_li, added_at, type, d.status, position, employer, job_ad_url, job_ad_filename, customer_comment, paid_on, d.lang as order_lang,
        edition,
        u.id as customer_id, u.prenume as customer_first_name, u.nume as customer_last_name, u.email as customer_email, u.linkedin_basic_profile_fields as customer_li_fields, u.registered_at as customer_creation_date, u.tp as customer_account_type, u.lang as customer_lang,
        r.id as rater_id, r.prenume as rater_first_name, r.nume as rater_last_name, r.email as rater_email, r.linkedin_basic_profile_fields as rater_li_fields, r.registered_at as rater_creation_date, r.tp as rater_account_type, r.lang as rater_lang,
        c.id as coupon_id, c.name, c.tp as coupon_type, number_of_times, discount, discount_type, valid_date, campaign_name, error_message
      from documents d
        inner join product_edition e on e.id = d.edition_id
        inner join useri u on u.id = d.added_by
        inner join useri r on r.id = d.assign_to
        left join codes c on c.name = d.code
      where """ + commonClause + """
        and d.status = """ + Order.statusIdAwaitingFeedback + """
      order by d.id desc;"""

    Logger.info("OrderDto.getOrdersAwaitingFeedback():" + query)

    processQuery(query)
  }

  /* Get all orders whose payment date is between "from" and "to"
  except those of IDs included in
   */
  def getOlderOrdersExcept(fromOpt: Option[Date], to: Date, excludedOrderIds: List[Long]): List[FrontendOrder] = {
    val paidAfterClause = fromOpt match {
      case None => ""
      case Some(from) => """
        and paid_on <= '""" + DbUtil.dateFormat.format(from) + """'"""
    }

    val paidBeforeClause = """
      and paid_on > '""" + DbUtil.dateFormat.format(to) + """'"""

    val exceptOrderIdClause = if (excludedOrderIds.length == 0) {
      ""
    } else {
      """
        and d.id not in (""" + excludedOrderIds.mkString(",") + """)"""
    }

    val query = """
        select d.id as order_id, file, file_cv, file_li, added_at, type, d.status, position, employer, job_ad_url, job_ad_filename, customer_comment, paid_on, d.lang as order_lang,
          edition,
          u.id as customer_id, u.prenume as customer_first_name, u.nume as customer_last_name, u.email as customer_email, u.linkedin_basic_profile_fields as customer_li_fields, u.registered_at as customer_creation_date, u.tp as customer_account_type, u.lang as customer_lang,
          r.id as rater_id, r.prenume as rater_first_name, r.nume as rater_last_name, r.email as rater_email, r.linkedin_basic_profile_fields as rater_li_fields, r.registered_at as rater_creation_date, r.tp as rater_account_type, r.lang as rater_lang,
          c.id as coupon_id, c.name, c.tp as coupon_type, number_of_times, discount, discount_type, valid_date, campaign_name, error_message
        from documents d
          inner join product_edition e on e.id = d.edition_id
          inner join useri u on u.id = d.added_by
          left join useri r on r.id = d.assign_to
          left join codes c on c.name = d.code
        where """ + commonClause +
      paidAfterClause +
      paidBeforeClause +
      exceptOrderIdClause + """
        order by d.status, d.id desc;"""

    Logger.info("OrderDto.getOlderOrdersExcept():" + query)

    processQuery(query)
  }

  def getOrdersFromCustomerWithReportSent(customerId: Long): List[FrontendOrder] = {
    val query = """
      select d.id as order_id, file, file_cv, file_li, added_at, type, d.status, position, employer, job_ad_url, job_ad_filename, customer_comment, paid_on, d.lang as order_lang,
        edition,
        u.id as customer_id, u.prenume as customer_first_name, u.nume as customer_last_name, u.email as customer_email, u.linkedin_basic_profile_fields as customer_li_fields, u.registered_at as customer_creation_date, u.tp as customer_account_type, u.lang as customer_lang,
        r.id as rater_id, r.prenume as rater_first_name, r.nume as rater_last_name, r.email as rater_email, r.linkedin_basic_profile_fields as rater_li_fields, r.registered_at as rater_creation_date, r.tp as rater_account_type, r.lang as rater_lang,
        c.id as coupon_id, c.name, c.tp as coupon_type, number_of_times, discount, discount_type, valid_date, campaign_name, error_message
      from documents d
        inner join product_edition e on e.id = d.edition_id
        inner join useri u on u.id = d.added_by
        inner join useri r on r.id = d.assign_to
        left join codes c on c.name = d.code
      where """ + commonClause + """
        and u.id = """ + customerId + """
        and d.status in (""" + Order.statusIdScheduled + """, """ + Order.statusIdComplete + """)
      order by d.id desc;"""

    // Commented out because it spams too much
    // Logger.info("OrderDto.getOrdersFromCustomerWithReportSent():" + query)

    processQuery(query)
  }

  def calculateOrdersSentToTheCustomer(from: Date, to: Date) {
    val query = """
        select d.id as order_id, file, file_cv, file_li, added_at, type, d.status, position, employer, job_ad_url, job_ad_filename, customer_comment, paid_on, d.lang as order_lang,
          edition,
          u.id as customer_id, u.prenume as customer_first_name, u.nume as customer_last_name, u.email as customer_email, u.linkedin_basic_profile_fields as customer_li_fields, u.registered_at as customer_creation_date, u.tp as customer_account_type, u.lang as customer_lang,
          r.id as rater_id, r.prenume as rater_first_name, r.nume as rater_last_name, r.email as rater_email, r.linkedin_basic_profile_fields as rater_li_fields, r.registered_at as rater_creation_date, r.tp as rater_account_type, r.lang as rater_lang,
          c.id as coupon_id, c.name, c.tp as coupon_type, number_of_times, discount, discount_type, valid_date, campaign_name, error_message
        from documents d
          inner join product_edition e on e.id = d.edition_id
          inner join useri u on u.id = d.added_by
          inner join useri r on r.id = d.assign_to
          left join codes c on c.name = d.code
        where """ + commonClause + """
          and paid_on >= '""" + DbUtil.dateFormat.format(from) + """'
          and paid_on < '""" + DbUtil.dateFormat.format(to) + """'
          and d.status in (""" + Order.statusIdScheduled + """, """ + Order.statusIdComplete + """)
        order by d.id desc;"""

    /* Commented because it spams too much
    Logger.info("OrderDto.getOrdersSentToCustomersOrderedBetween():" + query) */

    ordersSentToTheCustomer = processQuery(query)
  }

  def calculateOrdersToDo() {
    val query = """
        select d.id as order_id, file, file_cv, file_li, added_at, type, d.status, position, employer, job_ad_url, job_ad_filename, customer_comment, paid_on, d.lang as order_lang,
          edition,
          u.id as customer_id, u.prenume as customer_first_name, u.nume as customer_last_name, u.email as customer_email, u.linkedin_basic_profile_fields as customer_li_fields, u.registered_at as customer_creation_date, u.tp as customer_account_type, u.lang as customer_lang,
          r.id as rater_id, r.prenume as rater_first_name, r.nume as rater_last_name, r.email as rater_email, r.linkedin_basic_profile_fields as rater_li_fields, r.registered_at as rater_creation_date, r.tp as rater_account_type, r.lang as rater_lang,
          c.id as coupon_id, c.name, c.tp as coupon_type, number_of_times, discount, discount_type, valid_date, campaign_name, error_message
        from documents d
          inner join product_edition e on e.id = d.edition_id
          inner join useri u on u.id = d.added_by
          left join useri r on r.id = d.assign_to
          left join codes c on c.name = d.code
        where """ + commonClause + """
          and d.status in (""" + Order.statusIdPaid + """, """ + Order.statusIdInProgress + """)
        order by d.id desc;"""

    /* Commented because it spams too much
    Logger.info("OrderDto.calculateOrdersToDo():" + query) */

    ordersToDo = processQuery(query)
  }

  def getScheduledOrdersArrivedToTerm: List[Order] = {
    val oneDayAgoPlus90Minutes = Calendar.getInstance()
    oneDayAgoPlus90Minutes.add(Calendar.DATE, -1)
    oneDayAgoPlus90Minutes.add(Calendar.MINUTE, 90)

    val query = """
      select d.id as order_id, file, file_cv, file_li, added_at, type, d.status, position, employer, job_ad_url, job_ad_filename, customer_comment, paid_on, d.lang as order_lang,
        edition,
        u.id as customer_id, u.prenume as customer_first_name, u.nume as customer_last_name, u.email as customer_email, u.linkedin_basic_profile_fields as customer_li_fields, u.registered_at as customer_creation_date, u.tp as customer_account_type, u.lang as customer_lang,
        r.id as rater_id, r.prenume as rater_first_name, r.nume as rater_last_name, r.email as rater_email, r.linkedin_basic_profile_fields as rater_li_fields, r.registered_at as rater_creation_date, r.tp as rater_account_type, r.lang as rater_lang,
        c.id as coupon_id, c.name, c.tp as coupon_type, number_of_times, discount, discount_type, valid_date, campaign_name, error_message
      from documents d
        inner join product_edition e on e.id = d.edition_id
        inner join useri u on u.id = d.added_by
        inner join useri r on r.id = d.assign_to
        left join codes c on c.name = d.code
      where """ + commonClause + """
        and d.status = '""" + Order.statusIdScheduled + """'
        and paid_on < '""" + DbUtil.dateFormat.format(oneDayAgoPlus90Minutes.getTime) + """'
      order by d.id desc;"""

    // Commented out because it spams too much
    // Logger.info("OrderDto.getScheduledOrdersArrivedToTerm():" + query)

    processQuery(query).map(frontendOrder => new Order(frontendOrder))
  }

  /* Using JDBC here instead of Anorm due to issue https://github.com/playframework/anorm/issues/122 */
  private def processQuery(query: String): List[FrontendOrder] = {
    var orders = new ListBuffer[FrontendOrder]()
    val conn = db.getConnection()

    try {
      val rs = conn.createStatement.executeQuery(query)

      while (rs.next()) {
        val orderId = rs.getLong("order_id")

        val jobAdUrl = rs.getString("job_ad_url")
        val jobAdUrlOpt = if (rs.wasNull()) {
          None
        } else {
          Some(jobAdUrl)
        }

        val jobAdFileName = rs.getString("job_ad_filename")
        val jobAdFileNameOpt = if (rs.wasNull()) {
          None
        } else {
          Order.getFileNameWithoutPrefix(Some(jobAdFileName))
        }

        val customerComment = rs.getString("customer_comment")
        val customerCommentOpt = if (rs.wasNull()) {
          None
        } else {
          Some(customerComment)
        }

        val customerLastName = rs.getString("customer_last_name")
        val customerLastNameOpt = if (rs.wasNull()) {
          None
        } else {
          Some(customerLastName)
        }

        val couponId = rs.getLong("coupon_id")
        val (couponIdOpt, couponCodeOpt, couponTypeOpt, couponMaxUseCountOpt, couponAmountOpt, couponDiscountTypeOpt, couponExpirationDateOpt, couponCampaignNameOpt, couponExpiredMsgOpt) = if (rs.wasNull()) {
          (None, None, None, None, None, None, None, None, None)
        } else {
          val cpnXprdMsg = rs.getString("error_message")
          val cpnXprdMsgOpt = if (rs.wasNull()) {
            None
          } else {
            Some(cpnXprdMsg)
          }

          (Some(couponId),
            Some(rs.getString("name")),
            Some(rs.getInt("coupon_type")),
            Some(rs.getInt("number_of_times")),
            Some(rs.getInt("discount")),
            Some(rs.getString("discount_type")),
            Some(rs.getDate("valid_date")),
            Some(rs.getString("campaign_name")),
            cpnXprdMsgOpt)
        }

        val raterId = rs.getLong("rater_id")
        val (raterIdOpt, raterLastNameOpt) = if (rs.wasNull()) {
          (None, None)
        } else {
          val rtrLstNm = rs.getString("rater_last_name")
          val rtrLstNmOpt = if (rs.wasNull()) {
            None
          } else {
            Some(rtrLstNm)
          }

          (Some(raterId),
            rtrLstNmOpt)
        }

        val paymentTimestamp = rs.getTimestamp("paid_on").getTime

        val dueCal = Calendar.getInstance()
        dueCal.setTimeInMillis(paymentTimestamp)
        dueCal.add(Calendar.DATE, 1)
        dueCal.add(Calendar.MINUTE, -90)

        orders += FrontendOrder(
          id = orderId,

          idInBase64 = StringService.base64Encode(orderId.toString),

          editionCode = rs.getString("edition"),

          containedProductCodes = Order.getContainedProductCodesFromTypesString(rs.getString("type")),

          coupon = couponIdOpt match {
            case None => None
            case Some(cpnId) =>
              val (discountPercentageOpt, discountPriceOpt) = couponDiscountTypeOpt.get match {
                case "by_percent" => (couponAmountOpt, None)
                case "by_value" => (None, Some(Price(
                  amount = couponAmountOpt.get,
                  currencyCode = config.paymentCurrencyCode
                )))
              }

              Some(Coupon(
                id = cpnId,
                code = couponCodeOpt.get,
                campaignName = couponCampaignNameOpt.get,
                expirationTimestamp = couponExpirationDateOpt.get.getTime,
                discountPercentage = discountPercentageOpt,
                discountPrice = discountPriceOpt,
                `type` = couponTypeOpt.get,
                maxUseCount = couponMaxUseCountOpt.get,
                couponExpiredMsg = couponExpiredMsgOpt
              ))
          },

          cvFileName = rs.getString("file") match {
            case "" => None
            case otherString => Order.getFileNameWithoutPrefix(Some(otherString))
          },

          coverLetterFileName = rs.getString("file_cv") match {
            case "" => None
            case otherString => Order.getFileNameWithoutPrefix(Some(otherString))
          },

          linkedinProfileFileName = rs.getString("file_li") match {
            case "" => None
            case otherString => Order.getFileNameWithoutPrefix(Some(otherString))
          },

          positionSought = rs.getString("position") match {
            case "" => None
            case otherString => Some(otherString)
          },

          employerSought = rs.getString("employer") match {
            case "" => None
            case otherString => Some(otherString)
          },

          jobAdUrl = jobAdUrlOpt,

          jobAdFileName = jobAdFileNameOpt,

          customerComment = customerCommentOpt,

          customer = Account(
            id = rs.getLong("customer_id"),
            firstName = rs.getString("customer_first_name"),
            lastName = customerLastNameOpt,
            emailAddress = rs.getString("customer_email"),
            linkedinProfile = rs.getString("customer_li_fields") match {
              case "" => JsNull
              case otherString => Json.parse(otherString)
            },
            `type` = rs.getInt("customer_account_type"),
            languageCode = rs.getString("customer_lang"),
            creationTimestamp = rs.getTimestamp("customer_creation_date").getTime
          ),

          rater = raterIdOpt match {
            case None => None
            case Some(rtrId) => Some(Account(
              id = rtrId,
              firstName = rs.getString("rater_first_name"),
              lastName = raterLastNameOpt,
              emailAddress = rs.getString("rater_email"),
              linkedinProfile = rs.getString("rater_li_fields") match {
                case "" => JsNull
                case otherString => Json.parse(otherString)
              },
              `type` = rs.getInt("rater_account_type"),
              languageCode = rs.getString("rater_lang"),
              creationTimestamp = rs.getTimestamp("rater_creation_date").getTime
            ))
          },

          status = rs.getInt("status"),

          languageCode = rs.getString("order_lang"),

          creationTimestamp = rs.getTimestamp("added_at").getTime,

          paymentTimestamp = paymentTimestamp,

          dueTimestamp = dueCal.getTimeInMillis
        )
      }

      orders.toList
    } finally {
      conn.close()
    }
  }

  private def processQuerySingle(query: String): Option[FrontendOrder] = {
    val list = processQuery(query)

    if (list.isEmpty) {
      None
    } else {
      Some(list.head)
    }
  }
}
