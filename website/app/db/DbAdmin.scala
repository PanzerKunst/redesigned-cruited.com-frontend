package db

import anorm._
import play.api.Logger
import play.api.Play.current
import play.api.db.DB

object DbAdmin {
  def reCreateTables() {
    dropTable("reduction")
    dropTable("product")

    createTableProduct()
    createTableReduction()
  }

  private def createTableProduct() {
    DB.withConnection { implicit c =>
      val query = """
          create table product (
            id serial,
            code varchar(32) not null,
            price_amount decimal(5,2) not null,
            price_currency_code varchar(3) not null,
            primary key(id)
          ) ENGINE=INNODB DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci;"""

      Logger.info("DbAdmin.createTableProduct():" + query)

      SQL(query).executeUpdate()
    }
  }

  private def createTableReduction() {
    DB.withConnection { implicit c =>
      val query = """
          create table reduction (
            id serial,
            code varchar(32) not null,
            reduction_amount decimal(5,2) not null,
            reduction_currency_code varchar(3) not null,
            primary key(id)
          ) ENGINE=INNODB DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci;"""

      Logger.info("DbAdmin.createTableReduction():" + query)

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
    initDataReduction()
  }

  private def initDataProduct() {
    DB.withConnection { implicit c =>
        SQL("insert into product(code, price_amount, price_currency_code) values('CV_REVIEW', 299, 'SEK');").execute()
        SQL("insert into product(code, price_amount, price_currency_code) values('COVER_LETTER_REVIEW', 299, 'SEK');").execute()
        SQL("insert into product(code, price_amount, price_currency_code) values('LINKEDIN_PROFILE_REVIEW', 299, 'SEK');").execute()
    }
  }

  private def initDataReduction() {
    DB.withConnection { implicit c =>
        SQL("insert into reduction(code, reduction_amount, reduction_currency_code) values('2_PRODUCTS_SAME_ORDER', 100, 'SEK');").execute()
        SQL("insert into reduction(code, reduction_amount, reduction_currency_code) values('3_PRODUCTS_SAME_ORDER', 200, 'SEK');").execute()
    }
  }
}
