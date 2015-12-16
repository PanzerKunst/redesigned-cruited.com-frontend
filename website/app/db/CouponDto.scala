package db

import anorm.SqlParser._
import anorm._
import models.{Coupon, Price}
import play.api.Logger
import play.api.Play.current
import play.api.db.DB

object CouponDto {
  def getOfId(id: Long): Option[Coupon] = {
    DB.withConnection { implicit c =>
      val query = """
      select name, discount, discount_type, valid_date, campaign_name
      from codes
      where id = """ + id + """
      limit 1;"""

      Logger.info("CouponDto.getOfId():" + query)

      val rowParser = str("name") ~ int("discount") ~ str("discount_type") ~ date("valid_date") ~ str("campaign_name") map {
        case code ~ amount ~ discountType ~ expirationDate ~ campaignName =>
          val (discountPercentageOpt, discountPriceOpt) = discountType match {
            case "by_percent" => (Some(amount), None)
            case "by_value" => (None, Some(Price(
              amount = amount,
              currencyCode = "SEK"
            )))
          }

          Coupon(
            id = id,
            code = code,
            campaignName = campaignName,
            expirationTimestamp = expirationDate.getTime,
            discountPercentage = discountPercentageOpt,
            discountPrice = discountPriceOpt
          )
      }

      SQL(query).as(rowParser.singleOpt)
    }
  }

  def getOfCode(code: String): Option[Coupon] = {
    DB.withConnection { implicit c =>
      val query = """
      select id, discount, discount_type, valid_date, campaign_name
      from codes
      where shw = 1
        and name = '""" + DbUtil.safetize(code) + """'
        and valid_date > now()
      limit 1;"""

      Logger.info("CouponDto.getOfCode():" + query)

      val rowParser = long("id") ~ int("discount") ~ str("discount_type") ~ date("valid_date") ~ str("campaign_name") map {
        case id ~ amount ~ discountType ~ expirationDate ~ campaignName =>
          val (discountPercentageOpt, discountPriceOpt) = discountType match {
            case "by_percent" => (Some(amount), None)
            case "by_value" => (None, Some(Price(
              amount = amount,
              currencyCode = "SEK"
            )))
          }

          Coupon(
            id = id,
            code = code,
            campaignName = campaignName,
            expirationTimestamp = expirationDate.getTime,
            discountPercentage = discountPercentageOpt,
            discountPrice = discountPriceOpt
          )
      }

      SQL(query).as(rowParser.singleOpt)
    }
  }
}
