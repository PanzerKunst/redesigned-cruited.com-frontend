package controllers.api

import javax.inject.Singleton

import db.DbAdmin
import play.api.mvc.{Action, Controller}
import services.ConfigHelper

@Singleton
class DbAdminApi extends Controller {
  def reCreateTables = Action { request =>
    if (request.queryString.contains("key") &&
      request.queryString.get("key").get.head == ConfigHelper.applicationSecret) {
      DbAdmin.reCreateTables()
      DbAdmin.initData()
      Created
    }
    else
      Forbidden("Wrong key")
  }
}
