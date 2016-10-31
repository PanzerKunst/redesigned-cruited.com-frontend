package controllers

import javax.inject._

import db.{AssessmentDto, AccountDto, OrderDto}
import play.api.mvc._
import services.{GlobalConfig, Scheduler, SessionService}

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class AssessmentController @Inject()(config: GlobalConfig, accountDto: AccountDto, orderDto: OrderDto, assessmentDto: AssessmentDto) extends Controller {

  def index(id: Long) = Action { request =>
    SessionService.getAccountId(request.session) match {
      case None => Redirect("/login")
      case Some(accountId) => accountDto.getOfId(accountId) match {
        case None => BadRequest("No account found in DB for ID " + accountId)
        case Some(account) =>
          val order = orderDto.get(id).get
          val allDefaultComments = assessmentDto.allDefaultComments
          val allCommentVariations = assessmentDto.allCommentVariations

          Ok(views.html.assessment(account, config, order, allDefaultComments, allCommentVariations))
      }
    }
  }
}
