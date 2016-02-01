package db

import anorm.SqlParser._
import anorm._
import models.{CruitedProduct, Price}
import play.api.Logger
import play.api.Play.current
import play.api.db.DB
import services.GlobalConfig

object CruitedProductDto {
  def getAll: List[CruitedProduct] = {
    DB.withConnection { implicit c =>
      val query = """
        select id, code, price_amount
        from product
        where price_currency_code = '""" + GlobalConfig.paymentCurrencyCode + """'
        order by id;"""

      Logger.info("CruitedProductDto.getAll():" + query)

      val rowParser = long("id") ~ str("code") ~ double("price_amount") map {
        case id ~ code ~ priceAmount =>
          CruitedProduct(
            id = id,
            code = code,
            price = Price(
              amount = priceAmount,
              currencyCode = GlobalConfig.paymentCurrencyCode
            )
          )
      }

      SQL(query).as(rowParser.*)
    }
  }

  def getOfId(id: Long): Option[CruitedProduct] = {
    DB.withConnection { implicit c =>
      val query = """select code, price_amount
      from product
      where price_currency_code = '""" + GlobalConfig.paymentCurrencyCode + """'
        and id = """ + id + """
      limit 1;"""

      Logger.info("CruitedProductDto.getOfId():" + query)

      val rowParser = str("code") ~ double("price_amount") map {
        case code ~ priceAmount =>
          CruitedProduct(
            id = id,
            code = code,
            price = Price(
              amount = priceAmount,
              currencyCode = GlobalConfig.paymentCurrencyCode
            )
          )
      }

      SQL(query).as(rowParser.singleOpt)
    }
  }
}
