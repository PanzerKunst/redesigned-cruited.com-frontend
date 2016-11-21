package controllers

import javax.inject._

import db.{ReportDto, AccountDto, AssessmentDto, OrderDto}
import play.api.i18n.MessagesApi
import play.api.mvc._
import services.{GlobalConfig, SessionService}

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class AssessmentController @Inject()(accountDto: AccountDto, config: GlobalConfig, orderDto: OrderDto, messagesApi: MessagesApi, reportDto: ReportDto, assessmentDto: AssessmentDto) extends Controller {

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
          val assessmentReportOpt = reportDto.getOfOrderId(orderId)

          Ok(views.html.assessment(account, config, order, i18nMessages, allDefaultComments, allCommentVariations, assessmentReportOpt))
      }
    }
  }
}
