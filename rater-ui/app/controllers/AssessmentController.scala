package controllers

import javax.inject._

import db.{AccountDto, AssessmentDto, OrderDto}
import play.api.i18n.MessagesApi
import play.api.mvc._
import services.{GlobalConfig, SessionService}

@Singleton
class AssessmentController @Inject()(accountDto: AccountDto, config: GlobalConfig, orderDto: OrderDto, messagesApi: MessagesApi, assessmentDto: AssessmentDto) extends BaseController {
  def index(orderId: Long) = Action { request =>
    SessionService.getAccountId(request.session) match {
      case None => Redirect("/login")
      case Some(accountId) => accountDto.getOfId(accountId) match {
        case None => BadRequest("No account found in DB for ID " + accountId)
        case Some(account) =>
          val order = orderDto.getOfId(orderId).get
          val i18nMessages = SessionService.getI18nMessagesFromCode(order.languageCode, messagesApi)
          val allDefaultComments = assessmentDto.allDefaultComments
          val allCommentVariations = assessmentDto.allCommentVariations
          val assessmentOpt = assessmentDto.getOfOrderId(orderId)

          Ok(views.html.assessment(account, config, order, i18nMessages, allDefaultComments, allCommentVariations, assessmentOpt))
            .withHeaders(doNotCachePage: _*)  // We want to avoid retrieving a cached page when navigating back
      }
    }
  }
}
