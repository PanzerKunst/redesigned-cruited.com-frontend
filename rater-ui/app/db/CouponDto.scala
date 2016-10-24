package db

import javax.inject.{Inject, Singleton}

import anorm.SqlParser._
import anorm._
import models.{Coupon, Price}
import play.api.Logger
import play.api.db.Database
import services.GlobalConfig

@Singleton
class CouponDto @Inject()(db: Database, config: GlobalConfig) {
  def getOfId(id: Long): Option[Coupon] = {
    db.withConnection { implicit c =>
      val query = """
      select name, tp, number_of_times, discount, discount_type, valid_date, campaign_name, error_message
      from codes
      where shw = 1
        and id = """ + id + """
      limit 1;"""

      Logger.info("CouponDto.getOfId():" + query)

      val rowParser = str("name") ~ int("tp") ~ int("number_of_times") ~ int("discount") ~ str("discount_type") ~ date("valid_date") ~ str("campaign_name") ~ (str("error_message") ?) map {
        case code ~ couponType ~ maxUseCount ~ amount ~ discountType ~ expirationDate ~ campaignName ~ couponExpiredMsgOpt =>
          val (discountPercentageOpt, discountPriceOpt) = discountType match {
            case "by_percent" => (Some(amount), None)
            case "by_value" => (None, Some(Price(
              amount = amount,
              currencyCode = config.paymentCurrencyCode
            )))
          }

          Coupon(
            id = id,
            code = code,
            campaignName = campaignName,
            expirationTimestamp = expirationDate.getTime,
            discountPercentage = discountPercentageOpt,
            discountPrice = discountPriceOpt,
            `type` = couponType,
            maxUseCount = maxUseCount,
            couponExpiredMsg = couponExpiredMsgOpt
          )
      }

      SQL(query).as(rowParser.singleOpt)
    }
  }
}
