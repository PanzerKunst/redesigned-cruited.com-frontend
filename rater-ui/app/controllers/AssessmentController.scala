package controllers

import javax.inject._

import db.{AccountDto, OrderDto}
import play.api.mvc._
import services.{GlobalConfig, Scheduler, SessionService}

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class AssessmentController @Inject()(accountDto: AccountDto, orderDto: OrderDto, config: GlobalConfig) extends Controller {

  def index(id: Long) = Action { request =>
    SessionService.getAccountId(request.session) match {
      case None => Redirect("/login")
      case Some(accountId) => accountDto.getOfId(accountId) match {
        case None => BadRequest("No account found in DB for ID " + accountId)
        case Some(account) => Ok(views.html.assessment(account, config, orderDto.get(id).get))
      }
    }
  }
}
