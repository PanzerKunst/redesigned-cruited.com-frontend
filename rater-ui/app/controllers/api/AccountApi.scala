package controllers.api

import javax.inject.{Inject, Singleton}

import db.AccountDto
import play.api.libs.json._
import play.api.mvc.{Action, Controller}
import services._

@Singleton
class AccountApi @Inject()(val accountDto: AccountDto) extends Controller {
  def allRaters = Action { request =>
    SessionService.getAccountId(request.session) match {
      case None => Unauthorized
      case Some(accountId) => accountDto.getOfId(accountId) match {
        case None => BadRequest("No account found in DB for ID " + accountId)
        case Some(_) => Ok(Json.toJson(accountDto.getAllRaters))
      }
    }
  }
}
