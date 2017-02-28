package db

import anorm._
import models.CruitedProduct
import play.api.Logger
import play.api.Play.current
import play.api.db.DB
import services.GlobalConfig

object DbAdmin {
  def reCreateTables() {
    dropTable("better_scores")
    dropTable("better_score_desc")
    dropTable("custom_warning_message")
    dropTable("defaults_en")
    dropTable("default_categories_en")
    dropTable("default_grades")
    dropTable("default_grades_en")
    dropTable("default_variations_en")
    dropTable("document_payment_detail")
    dropTable("document_payment_detail_demo")
    dropTable("documents_aux")
    dropTable("email_sender_info")
    dropTable("emails")
    dropTable("free_document_status")
    dropTable("login_log")
    dropTable("logs")
    dropTable("partners_summary")
    dropTable("prices")
    dropTable("richtext")
    dropTable("term_accceptation")
    dropTable("vocabulary")
    dropTable("interview_training_order_info")
    dropTable("it_order_info")

    createTableInterviewTrainingOrderInfo()

    removeAlterationOnTableDefaultCategories()
    alterTableDefaultCategories()

    removeAlterationOnTableDocuments()
    alterTableDocuments()

    removeAlterationOnTableUseri()
    alterTableUseri()
  }

  private def dropTable(tableName: String) {
    DB.withConnection { implicit c =>
      val query = "drop table if exists " + tableName + ";"
      Logger.info("DbAdmin.dropTable(): " + query)
      SQL(query).executeUpdate()
    }
  }

  private def createTableInterviewTrainingOrderInfo() {
    DB.withConnection { implicit c =>
      val query = """
          create table it_order_info (
            id serial,
            order_id bigint not null,
            interview_date date,
            important_for_the_role varchar(2048),
            latest_interview varchar(2048),
            need_for_improvement varchar(2048),
            challenging_questions varchar(2048),
            primary key(id),
            constraint fk_documents_id foreign key(order_id) references documents(id)
          ) ENGINE=INNODB DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci;"""

      Logger.info("DbAdmin.createTableInterviewTrainingOrderInfo():" + query)

      SQL(query).executeUpdate()
    }
  }

  private def removeAlterationOnTableDefaultCategories() {
    DB.withConnection { implicit c =>
      val query = """
        alter table default_categories
        add descr text,
        add full_descr text,
        add icon varchar(255),
        add top_comment text;"""

      Logger.info("DbAdmin.removeAlterationOnTableDefaultCategories():" + query)

      SQL(query).executeUpdate()
    }
  }

  private def alterTableDefaultCategories() {
    DB.withConnection { implicit c =>
      val query = """
        alter table default_categories
        drop column descr,
        drop column full_descr,
        drop column icon,
        drop column top_comment;"""

      Logger.info("DbAdmin.alterTableDefaultCategories():" + query)

      SQL(query).executeUpdate()
    }
  }

  private def removeAlterationOnTableDocuments() {
    DB.withConnection { implicit c =>
      val query = """
        alter table documents
        modify edition_id int(11) not null;"""

      Logger.info("DbAdmin.removeAlterationOnTableDocuments():" + query)

      SQL(query).executeUpdate()
    }
  }

  private def alterTableDocuments() {
    DB.withConnection { implicit c =>
      val query = """
        alter table documents
        modify edition_id int(11);"""

      Logger.info("DbAdmin.alterTableDocuments():" + query)

      SQL(query).executeUpdate()
    }
  }

  private def removeAlterationOnTableUseri() {
    DB.withConnection { implicit c =>
      val query = """
        alter table useri
        add code varchar(255);"""

      Logger.info("DbAdmin.removeAlterationOnTableUseri():" + query)

      SQL(query).executeUpdate()
    }
  }

  private def alterTableUseri() {
    DB.withConnection { implicit c =>
      val query = """
        alter table useri
        drop column code;"""

      Logger.info("DbAdmin.alterTableUseri():" + query)

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
          where code = '""" + CruitedProduct.CodeInterviewTraining + """';""").execute()

      SQL("""insert into product(code, price_amount, price_currency_code)
          values('""" + CruitedProduct.CodeInterviewTraining + """', 299, '""" + GlobalConfig.paymentCurrencyCode + """');""").execute()
    }
  }

  def fixBothersomeCharactersInLinkedinProfile() {
    val ids = AccountDto.getIdsOfAccountsWithBothersomeCharactersInLinkedinProfile

    if (ids.nonEmpty) {
      AccountDto.cleanLinkedinProfileOfIds(ids)
    }
  }
}
