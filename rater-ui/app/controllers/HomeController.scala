package controllers

import javax.inject._

import db.{AccountDto, OrderDto}
import play.api.mvc._
import services.{GlobalConfig, Scheduler, SessionService}

@Singleton
class HomeController @Inject()(accountDto: AccountDto, config: GlobalConfig, orderDto: OrderDto, scheduler: Scheduler) extends BaseController {

  def index = Action { request =>
    SessionService.getAccountId(request.session) match {
      case None => Redirect("/login")
      case Some(accountId) => accountDto.getOfId(accountId) match {
        case None => BadRequest("No account found in DB for ID " + accountId)
        case Some(account) => Ok(views.html.orderList(account, config))
          .withHeaders(doNotCachePage: _*)  // We want to avoid retrieving a cached page when navigating back
      }
    }
  }

  def signOut = Action { request =>
    Redirect("/").withNewSession
  }

  def signIn = Action { request =>
    Ok(views.html.signIn())
  }
}
