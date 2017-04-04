package db

import anorm.SqlParser._
import anorm._
import models.{CruitedProduct, Price}
import play.api.Logger
import play.api.Play.current
import play.api.db.DB
import services.GlobalConfig

object CruitedProductDto {
  private val commonClause = "price_currency_code = '" + GlobalConfig.paymentCurrencyCode + "'"

  def getAll: List[CruitedProduct] = {
    DB.withConnection { implicit c =>
      val query = """
        select id, code, price_amount
        from product
        where """ + commonClause + """
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

  def getForMainOrderPage: List[CruitedProduct] = {
    DB.withConnection { implicit c =>
      val query = """
        select id, code, price_amount
        from product
        where """ + commonClause + """
          and code in ('""" + CruitedProduct.CodeCvReview + """', '""" + CruitedProduct.CodeCoverLetterReview + """', '""" + CruitedProduct.CodeLinkedinProfileReview + """')
        order by id;"""

      Logger.info("CruitedProductDto.getForMainOrderPage():" + query)

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
  
  def getForConsultantOrderPage: List[CruitedProduct] = {
    DB.withConnection { implicit c =>
      val query = """
        select id, code, price_amount
        from product
        where """ + commonClause + """
          and code in ('""" + CruitedProduct.CodeCvReviewForConsultant + """', '""" + CruitedProduct.CodeLinkedinProfileReviewForConsultant + """')
        order by id;"""

      Logger.info("CruitedProductDto.getForConsultantOrderPage():" + query)

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
  
  def getForInterviewTrainingOrderPage: CruitedProduct = {
    DB.withConnection { implicit c =>
      val query = """
        select id, code, price_amount
        from product
        where """ + commonClause + """
          and code = '""" + CruitedProduct.CodeInterviewTraining + """'
        order by id;"""

      Logger.info("CruitedProductDto.getForInterviewTrainingOrderPage():" + query)

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

      SQL(query).as(rowParser.single)
    }
  }
  def getOfId(id: Long): Option[CruitedProduct] = {
    DB.withConnection { implicit c =>
      val query = """select code, price_amount
      from product
      where """ + commonClause + """
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
