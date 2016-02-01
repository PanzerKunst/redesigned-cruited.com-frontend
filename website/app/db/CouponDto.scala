package db

import anorm.SqlParser._
import anorm._
import models.{Coupon, Price}
import play.api.Logger
import play.api.Play.current
import play.api.db.DB
import services.GlobalConfig

object CouponDto {
  def getOfId(id: Long): Option[Coupon] = {
    DB.withConnection { implicit c =>
      val query = """
      select name, tp, number_of_times, discount, discount_type, valid_date, campaign_name
      from codes
      where shw = 1
        and valid_date > now()
        and id = """ + id + """
      limit 1;"""

      Logger.info("CouponDto.getOfId():" + query)

      val rowParser = str("name") ~ int("tp") ~ int("number_of_times") ~ int("discount") ~ str("discount_type") ~ date("valid_date") ~ str("campaign_name") map {
        case code ~ couponType ~ maxUseCount ~ amount ~ discountType ~ expirationDate ~ campaignName =>
          val (discountPercentageOpt, discountPriceOpt) = discountType match {
            case "by_percent" => (Some(amount), None)
            case "by_value" => (None, Some(Price(
              amount = amount,
              currencyCode = GlobalConfig.paymentCurrencyCode
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
            maxUseCount = maxUseCount
          )
      }

      SQL(query).as(rowParser.singleOpt)
    }
  }

  def getOfCode(code: String): Option[Coupon] = {
    DB.withConnection { implicit c =>
      val query = """
      select id, tp, number_of_times, discount, discount_type, valid_date, campaign_name
      from codes
      where shw = 1
        and valid_date > now()
        and name = '""" + DbUtil.safetize(code) + """'
      limit 1;"""

      Logger.info("CouponDto.getOfCode():" + query)

      val rowParser = long("id") ~ int("tp") ~ int("number_of_times") ~ int("discount") ~ str("discount_type") ~ date("valid_date") ~ str("campaign_name") map {
        case id ~ couponType ~ maxUseCount ~ amount ~ discountType ~ expirationDate ~ campaignName =>
          val (discountPercentageOpt, discountPriceOpt) = discountType match {
            case "by_percent" => (Some(amount), None)
            case "by_value" => (None, Some(Price(
              amount = amount,
              currencyCode = GlobalConfig.paymentCurrencyCode
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
            maxUseCount = maxUseCount
          )
      }

      SQL(query).as(rowParser.singleOpt)
    }
  }

  def useCount(code: String, accountIdOpt: Option[Long]): Int = {
    DB.withConnection { implicit c =>
      val addedByClause = accountIdOpt match {
        case None => ""
        case Some(accountId) => """
          and added_by = """ + accountId + """
          and id > 0"""
      }

      val query = """
      select count(id) as count
      from documents
      where code = '""" + code + """'""" +
        addedByClause + """;"""

      Logger.info("CouponDto.useCount():" + query)

      val rowParser = int("count") map {
        case count => count
      }

      SQL(query).as(rowParser.single)
    }
  }
}
