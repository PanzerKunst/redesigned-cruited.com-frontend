package db

import anorm._
import models.CruitedProduct
import play.api.Logger
import play.api.Play.current
import play.api.db.DB
import services.GlobalConfig

object DbAdmin {
  def reCreateTables() {
  }

  private def dropTable(tableName: String) {
    DB.withConnection { implicit c =>
      val query = "drop table if exists " + tableName + ";"
      Logger.info("DbAdmin.dropTable(): " + query)
      SQL(query).executeUpdate()
    }
  }

  def initData() {
    initDataProduct()
    fixBothersomeCharactersInLinkedinProfile()
  }

  private def initDataProduct() {
    DB.withConnection { implicit c =>
      SQL("""delete from product
          where code = '""" + CruitedProduct.CodeCvReviewForConsultant + """';""").execute()

      SQL("""delete from product
          where code = '""" + CruitedProduct.CodeLinkedinProfileReviewForConsultant + """';""").execute()

      SQL("""insert into product(code, price_amount, price_currency_code)
          values('""" + CruitedProduct.CodeCvReviewForConsultant + """', 299, '""" + GlobalConfig.paymentCurrencyCode + """');""").execute()

      SQL("""insert into product(code, price_amount, price_currency_code)
          values('""" + CruitedProduct.CodeLinkedinProfileReviewForConsultant + """', 299, '""" + GlobalConfig.paymentCurrencyCode + """');""").execute()
    }
  }

  def fixBothersomeCharactersInLinkedinProfile() {
    val ids = AccountDto.getIdsOfAccountsWithBothersomeCharactersInLinkedinProfile

    if (ids.nonEmpty) {
      AccountDto.cleanLinkedinProfileOfIds(ids)
    }
  }
}
