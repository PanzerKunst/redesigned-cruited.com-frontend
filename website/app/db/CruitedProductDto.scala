package db

import anorm._
import models.{CruitedProduct, Price}
import play.api.Logger
import play.api.Play.current
import play.api.db.DB

object CruitedProductDto {
  val all = getAll

  private def getAll: List[CruitedProduct] = {
    DB.withConnection { implicit c =>
      val query = """
        select id, code, price_amount
        from product
        where price_currency_code = 'SEK';"""

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
}
