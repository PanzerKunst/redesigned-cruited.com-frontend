package db

import anorm._
import models.CruitedProduct
import play.api.Logger
import play.api.Play.current
import play.api.db.DB

object DbAdmin {
  def reCreateTables() {
    dropTable("product")
    createTableProduct()
  }

  private def createTableProduct() {
    DB.withConnection { implicit c =>
      val query = """
          create table product (
            id serial,
            code varchar(32) not null,
            price_amount decimal(5,2) not null,
            price_currency_code varchar(3) not null,
            primary key(id),
            constraint unique_code unique(code)
          ) ENGINE=INNODB DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci;"""

      Logger.info("DbAdmin.createTableProduct():" + query)

      SQL(query).executeUpdate()
    }
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
  }

  private def initDataProduct() {
    DB.withConnection { implicit c =>
      SQL("insert into product(code, price_amount, price_currency_code) values('" + CruitedProduct.codeCvReview + "', 299, 'SEK');").execute()
      SQL("insert into product(code, price_amount, price_currency_code) values('" + CruitedProduct.codeCoverLetterReview + "', 299, 'SEK');").execute()
      SQL("insert into product(code, price_amount, price_currency_code) values('" + CruitedProduct.codeLinkedinProfileReview + "', 299, 'SEK');").execute()
    }
  }
}
