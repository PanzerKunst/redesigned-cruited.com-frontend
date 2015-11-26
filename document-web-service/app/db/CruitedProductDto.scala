package db

import anorm.SqlParser._
import anorm._
import models.{CruitedProduct, Price}
import play.api.Logger
import play.api.Play.current
import play.api.db.DB

object CruitedProductDto {
  def getAll: List[CruitedProduct] = {
    DB.withConnection { implicit c =>
      val query = """
        select id, code, price_amount
        from product
        where price_currency_code = 'SEK'
        order by id;"""

      Logger.info("CruitedProductDto.getAll():" + query)

      SQL(query)().map { row =>
        CruitedProduct(
          id = row[Long]("id"),
          code = row[String]("code"),
          price = Price(
            amount = row[Double]("price_amount"),
            currencyCode = "SEK"
          )
        )
      }.toList
    }
  }

  def getOfId(id: Long): Option[CruitedProduct] = {
    DB.withConnection { implicit c =>
      val query = """select code, price_amount
      from product
      where price_currency_code = 'SEK'
        and id = """ + id + """
      limit 1;"""

      Logger.info("CruitedProductDto.getOfId():" + query)

      val optionRowParser = str("code") ~ double("price_amount") map {
        case code ~ priceAmount =>
          CruitedProduct(
            id = id,
            code = code,
            price = Price(
              amount = priceAmount,
              currencyCode = "SEK"
            )
          )
      }

      SQL(query).as(optionRowParser.singleOpt)
    }
  }
}