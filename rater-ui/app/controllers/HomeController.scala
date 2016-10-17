package controllers

import javax.inject._

import db.AccountDto
import play.api.mvc._
import services.SessionService

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class HomeController @Inject()(accountDto: AccountDto) extends Controller {

  def index = Action { request =>
    SessionService.getAccountId(request.session) match {
      case None => Redirect("/login")
      case Some(accountId) => Ok(views.html.assessmentList(accountDto.getOfId(accountId)))
    }
  }

  def signOut = Action { request =>
    Redirect("/").withNewSession
  }

  def signIn = Action { request =>
    Ok(views.html.signIn())
  }
}
