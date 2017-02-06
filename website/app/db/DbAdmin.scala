package db

import anorm._
import models.CruitedProduct
import play.api.Logger
import play.api.Play.current
import play.api.db.DB
import services.GlobalConfig

object DbAdmin {
  def reCreateTables() {
    removeAlterationOnTableDocuments()
    alterTableDocuments()
  }

  private def alterTableDocuments() {
    DB.withConnection { implicit c =>
      val query = """
        alter table documents
        drop column name,
        drop column hireability,
        drop column storytelling,
        drop column advanced_layout,
        drop column open_application,
        drop column li_url,
        drop column last_rate,
        drop column other_layout,
        drop column transaction_id,
        drop column response_code,
        drop column payment_id,
        drop column payment_client,
        drop column payment_card_type,
        drop column payment_card_holder,
        drop column payment_last4,
        drop column payment_error,
        drop column how_doing_status,
        drop column how_doing_text,
        drop column in_progress_at,
        drop column set_in_progress_at,
        drop column set_done_at,
        drop column done_email_sent,
        drop column 2days_after_assessment_delivered_email_sent,
        drop column doc_review,
        drop column free_test,
        drop column session_id,
        drop column google_thumb,
        add job_ad_filename varchar(255) after file_li;"""

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

  private def removeAlterationOnTableDocuments() {
    DB.withConnection { implicit c =>
      val query = """
        alter table documents
        add name varchar(255),
        add hireability float(5,2),
        add storytelling tinyint(1),
        add advanced_layout tinyint(1),
        add open_application tinyint(1),
        add li_url varchar(255),
        add last_rate date,
        add other_layout tinyint(1),
        add transaction_id varchar(255),
        add response_code int(8),
        add payment_id varchar(255),
        add payment_client varchar(255),
        add payment_card_type varchar(255),
        add payment_card_holder varchar(255),
        add payment_last4 int(4),
        add payment_error text,
        add how_doing_status int(2),
        add how_doing_text text,
        add in_progress_at bigint(20),
        add set_in_progress_at datetime,
        add set_done_at datetime,
        add done_email_sent tinyint(1),
        add 2days_after_assessment_delivered_email_sent tinyint(1) unsigned,
        add doc_review tinyint(4),
        add free_test tinyint(4),
        add session_id varchar(250),
        add google_thumb tinyint(4),
        drop column job_ad_filename;"""

      Logger.info("DbAdmin.removeAlterationOnTableDocuments():" + query)

      SQL(query).executeUpdate()
    }
  }

  def initData() {
    fixBothersomeCharactersInLinkedinProfile()
  }

  def fixBothersomeCharactersInLinkedinProfile() {
    val ids = AccountDto.getIdsOfAccountsWithBothersomeCharactersInLinkedinProfile
    AccountDto.cleanLinkedinProfileOfIds(ids)
  }
}
