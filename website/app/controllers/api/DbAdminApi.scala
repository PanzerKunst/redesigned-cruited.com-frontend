package controllers.api

import javax.inject.Singleton

import db.DbAdmin
import play.api.mvc.{Action, Controller}
import services.GlobalConfig

@Singleton
class DbAdminApi extends Controller {
  def reCreateTables() = Action { request =>
    if (request.queryString.contains("key") &&
      request.queryString("key").head == GlobalConfig.applicationSecret) {
      DbAdmin.reCreateTables()
      DbAdmin.initData()
      Created
    }
    else
      Forbidden("Wrong key")
  }

  def fixBothersomeCharactersInLinkedinProfile() = Action {
    DbAdmin.fixBothersomeCharactersInLinkedinProfile()
    Ok
  }
}
