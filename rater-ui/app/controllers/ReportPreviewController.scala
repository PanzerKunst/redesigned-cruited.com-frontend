package controllers

import java.util.Timer
import javax.inject._

import db.{ReportDto, AccountDto, OrderDto}
import play.api.i18n.MessagesApi
import play.api.mvc._
import services.{ScoreAverageTasker, GlobalConfig, SessionService}

@Singleton
class ReportPreviewController @Inject()(accountDto: AccountDto, config: GlobalConfig, orderDto: OrderDto, messagesApi: MessagesApi, reportDto: ReportDto, scoreAverageTasker: ScoreAverageTasker) extends BaseController {

  // Run the ScoreAverageTasker task after 0ms, repeating every day
  new Timer().schedule(scoreAverageTasker, 0, 3600 * 24 * 1000)

  def index(orderId: Long) = Action { request =>
    SessionService.getAccountId(request.session) match {
      case None => Redirect("/login")
      case Some(accountId) => accountDto.getOfId(accountId) match {
        case None => BadRequest("No account found in DB for ID " + accountId)
        case Some(account) =>
          reportDto.getOfOrderId(orderId) match {
            case None => BadRequest("No report available for order ID " + orderId)
            case Some(assessment) =>
              val order = orderDto.getOfId(orderId).get
              val i18nMessages = SessionService.getI18nMessagesFromCode(order.languageCode, messagesApi)

              Ok(views.html.reportPreview(account, config, order, i18nMessages, assessment, reportDto.getScoresOfOrderId(orderId), scoreAverageTasker.cvAverageScore, scoreAverageTasker.coverLetterAverageScore, scoreAverageTasker.linkedinProfileAverageScore))
          }
      }
    }
  }
}
