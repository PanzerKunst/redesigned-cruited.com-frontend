package db

import anorm._
import models.CruitedProduct
import play.api.Logger
import play.api.Play.current
import play.api.db.DB

object DbAdmin {
  def reCreateTables() {
    removeAlterationOnTableDocuments()
    removeAlterationOnTableEdition()
    dropTable("reduction")
    dropTable("product")

    createTableProduct()
    createTableReduction()
    alterTableEdition()
    alterTableDocuments()
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

  private def createTableReduction() {
    DB.withConnection { implicit c =>
      val query = """
          create table reduction (
            id serial,
            code varchar(32) not null,
            reduction_amount decimal(5,2) not null,
            reduction_currency_code varchar(3) not null,
            primary key(id),
            constraint unique_code unique(code)
          ) ENGINE=INNODB DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci;"""

      Logger.info("DbAdmin.createTableReduction():" + query)

      SQL(query).executeUpdate()
    }
  }

  private def alterTableEdition() {
    DB.withConnection { implicit c =>
      val query = """
        alter table product_edition
        add constraint unique_code unique(edition);"""

      Logger.info("DbAdmin.alterTableEdition():" + query)

      SQL(query).executeUpdate()
    }
  }

  // TODO: remove column `li_url`
  private def alterTableDocuments() {
    DB.withConnection { implicit c =>
      val query = """
        alter table documents
        add job_ad_url varchar(255) after employer,
        add customer_comment varchar(512) after job_ad_url;"""

      Logger.info("DbAdmin.alterTableDocuments():" + query)

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

  private def removeAlterationOnTableEdition() {
    DB.withConnection { implicit c =>
      val query = """
        alter table product_edition
        drop index unique_code;"""

      Logger.info("DbAdmin.removeAlterationOnTableEdition():" + query)

      SQL(query).executeUpdate()
    }
  }

  // TODO: add column `li_url`
  private def removeAlterationOnTableDocuments() {
    DB.withConnection { implicit c =>
      val query = """
        alter table documents
        drop column job_ad_url,
        drop column customer_comment;"""

      Logger.info("DbAdmin.removeAlterationOnTableDocuments():" + query)

      SQL(query).executeUpdate()
    }
  }

  def initData() {
    initDataProduct()
    initDataReduction()
  }

  private def initDataProduct() {
    DB.withConnection { implicit c =>
        SQL("insert into product(code, price_amount, price_currency_code) values('" + CruitedProduct.codeCvReview + "', 299, 'SEK');").execute()
        SQL("insert into product(code, price_amount, price_currency_code) values('" + CruitedProduct.codeCoverLetterReview + "', 299, 'SEK');").execute()
        SQL("insert into product(code, price_amount, price_currency_code) values('" + CruitedProduct.codeLinkedinProfileReview + "', 299, 'SEK');").execute()
    }
  }

  private def initDataReduction() {
    DB.withConnection { implicit c =>
        SQL("insert into reduction(code, reduction_amount, reduction_currency_code) values('2_PRODUCTS_SAME_ORDER', 100, 'SEK');").execute()
        SQL("insert into reduction(code, reduction_amount, reduction_currency_code) values('3_PRODUCTS_SAME_ORDER', 200, 'SEK');").execute()
    }
  }
}
