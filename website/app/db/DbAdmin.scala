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
        add li_profile_lang varchar(8) after file_li;"""

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
        drop li_profile_lang;"""

      Logger.info("DbAdmin.removeAlterationOnTableDocuments():" + query)

      SQL(query).executeUpdate()
    }
  }

  def initData() {
    fixBothersomeCharactersInLinkedinProfile()
  }

  def fixBothersomeCharactersInLinkedinProfile() {
    val ids = AccountDto.getIdsOfAccountsWithBothersomeCharactersInLinkedinProfile

    if (ids.nonEmpty) {
      AccountDto.cleanLinkedinProfileOfIds(ids)
    }
  }
}
