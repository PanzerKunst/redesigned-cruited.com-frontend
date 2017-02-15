package controllers.api

import javax.inject.{Inject, Singleton}

import db.AccountDto
import models.frontend.SignInData
import play.api.libs.json._
import play.api.mvc.{Action, Controller}
import services._

@Singleton
class AuthApi @Inject()(val accountDto: AccountDto) extends Controller {
  def signIn() = Action(parse.json) { request =>
    request.body.validate[SignInData] match {
      case _: JsError => BadRequest("Validation of SignInData failed")

      case s: JsSuccess[SignInData] =>
        val signInData = s.get

        accountDto.getOfEmailAndPassword(signInData.emailAddress, signInData.password) match {
          case None => Status(HttpService.httpStatusSignInIncorrectCredentials)
          case Some(account) =>
            val accountId = account.id

            Ok(Json.toJson(account))
              .withSession(request.session + (SessionService.sessionKeyAccountId -> accountId.toString))
        }
    }
  }
}
