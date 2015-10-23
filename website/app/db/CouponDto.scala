package db

import java.util.Date

import anorm._
import models.{Coupon, Price}
import play.api.Logger
import play.api.Play.current
import play.api.db.DB

object CouponDto {
  def getOfCode(code: String): Option[Coupon] = {
    DB.withConnection { implicit c =>
      val query = """select id, discount, discount_type, valid_date, campaign_name
      from codes
      where shw = 1
        and name = '""" + code + """'
        and valid_date > now()
      order by id;"""

      Logger.info("CouponDto.getOfCode():" + query)

      SQL(query).singleOpt() match {
        case None => None
        case Some(row) =>
          val (discountPercentageOpt, discountPriceOpt) = row[String]("discount_type") match {
            case "by_percent" => (Some(row[Int]("discount")), None)
            case "by_value" => (None, Some(Price(
              amount = row[Int]("discount"),
              currencyCode = "SEK"
            )))
          }

          Some(
            Coupon(
              id = row[Long]("id"),
              code = code,
              campaignName = row[String]("campaign_name"),
              expirationTimestamp = row[Date]("valid_date").getTime,
              discountPercentage = discountPercentageOpt,
              discountPrice = discountPriceOpt
            )
          )
      }
    }
  }
}
