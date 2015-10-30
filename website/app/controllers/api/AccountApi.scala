package controllers.api

import javax.inject.Singleton

import play.api.mvc.{Action, Controller}

@Singleton
class AccountApi extends Controller {
  def create = Action(parse.json) { request =>

    Created
  }
}
