package db

import anorm._
import models.{CruitedProduct, ProductPrice}
import play.api.Logger
import play.api.Play.current
import play.api.db.DB

object ProductDto {
  val all = getAll

  private def getAll: List[CruitedProduct] = {
    DB.withConnection { implicit c =>
      val query = """
        select p.id as product_id, code, pp.id as price_id, amount, currency_code
        from product p
        inner join product_price pp on pp.product_id = p.id;"""

      Logger.info("productDto.getAll():" + query)

      val denormalizedProducts = SQL(query)().map { row =>
        val id = row[Long]("product_id")
        val code = row[String]("code")
        val priceId = row[Long]("price_id")
        val amount = row[Double]("amount")
        val currencyCode = row[String]("currency_code")

        (id, code, priceId, amount, currencyCode)
      }.toList

      normalizeProducts(denormalizedProducts)
    }
  }

  private def normalizeProducts(denormalizedProducts: List[(Long, String, Long, Double, String)]): List[CruitedProduct] = {
    var normalizedProducts: List[CruitedProduct] = List()

    var currentProduct: Option[CruitedProduct] = None
    var currentPrices: List[ProductPrice] = List()

    for ((id, code, priceId, amount, currencyCode) <- denormalizedProducts) {
      if (!currentProduct.isDefined || id != currentProduct.get.id) {
        if (currentProduct.isDefined) {
          normalizedProducts = normalizedProducts :+ currentProduct.get
        }
        currentPrices = List(ProductPrice(priceId, id, amount, currencyCode))
        currentProduct = Some(CruitedProduct(
          id,
          code,
          currentPrices
        ))
      } else {
        currentPrices = currentPrices :+ ProductPrice(priceId, id, amount, currencyCode)
        currentProduct = Some(currentProduct.get.copy(prices = currentPrices))
      }
    }

    normalizedProducts = normalizedProducts :+ currentProduct.get

    normalizedProducts
  }
}
