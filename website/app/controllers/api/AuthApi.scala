package controllers.api

import javax.inject.Singleton

import db.AccountDto
import models.frontend.SignInData
import play.api.libs.json._
import play.api.mvc.{Action, Controller}
import services.SessionService

@Singleton
class AuthApi extends Controller {
  def signIn = Action(parse.json) { request =>
    request.body.validate[SignInData] match {
      case e: JsError => BadRequest("Validation of SignInData failed")

      case s: JsSuccess[SignInData] =>
        val signInData = s.get

        AccountDto.getOfEmailAndPassword(signInData.emailAddress, signInData.password) match {
          case None => NoContent
          case Some(account) => Ok.withSession(request.session + (SessionService.sessionKeyAccountId -> account.id.toString))
        }
    }
  }
}
