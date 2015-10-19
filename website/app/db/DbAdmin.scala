package db

import anorm._
import play.api.Logger
import play.api.Play.current
import play.api.db.DB

object DbAdmin {
  def reCreateTables() {
    dropTable("product_price")
    dropTable("product")

    createTableProduct()
    createTableProductPrice()
  }

  private def createTableProduct() {
    DB.withConnection { implicit c =>
      val query = """
          create table product (
            id serial,
            code varchar(32) not null,
            primary key(id)
          ) ENGINE=INNODB DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci;"""

      Logger.info("DbAdmin.createTableProduct():" + query)

      SQL(query).executeUpdate()
    }
  }

  private def createTableProductPrice() {
    DB.withConnection { implicit c =>
      val query = """
          create table product_price (
            id serial,
            product_id bigint unsigned not null,
            amount decimal(5,2) not null,
            currency_code varchar(3) not null,
            foreign key (product_id) references product(id)
          ) ENGINE=INNODB DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci;"""

      Logger.info("DbAdmin.createTableProductPrice():" + query)

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
    initDataProductPrice()
  }

  private def initDataProduct() {
    DB.withConnection {
      implicit c =>

        SQL("insert into product(code) values('CV_REVIEW');").execute()
        SQL("insert into product(code) values('COVER_LETTER_REVIEW');").execute()
        SQL("insert into product(code) values('LINKEDIN_PROFILE_REVIEW');").execute()
    }
  }

  private def initDataProductPrice() {
    DB.withConnection {
      implicit c =>

        SQL("insert into product_price(product_id, amount, currency_code) values(1, 299, 'SEK');").execute()
        SQL("insert into product_price(product_id, amount, currency_code) values(1, 39, 'USD');").execute()
        SQL("insert into product_price(product_id, amount, currency_code) values(2, 299, 'SEK');").execute()
        SQL("insert into product_price(product_id, amount, currency_code) values(2, 39, 'USD');").execute()
    }
  }
}
