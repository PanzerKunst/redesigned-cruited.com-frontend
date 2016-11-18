package controllers.api

import javax.inject.{Inject, Singleton}

import db.{AccountDto, ReportDto}
import models.frontend.FrontendOrder
import models.{AssessmentReport, Order}
import play.api.Logger
import play.api.libs.json._
import play.api.mvc.{Action, Controller}
import services._

@Singleton
class ReportApi @Inject()(val accountDto: AccountDto, val reportDto: ReportDto) extends Controller {
  def saveReport() = Action(parse.json) { request =>
    SessionService.getAccountId(request.session) match {
      case None => Unauthorized
      case Some(accountId) => accountDto.getOfId(accountId) match {
        case None => BadRequest("No account found in DB for ID " + accountId)
        case Some(account) =>
          request.body.validate[AssessmentReport] match {
            case e: JsError => BadRequest("Validation of AssessmentReport failed")

            case s: JsSuccess[AssessmentReport] =>
              val assessmentReport = s.get

              reportDto.deleteOfOrderId(assessmentReport.orderId)
              reportDto.create(assessmentReport)
              Ok
          }
      }
    }
  }
}
