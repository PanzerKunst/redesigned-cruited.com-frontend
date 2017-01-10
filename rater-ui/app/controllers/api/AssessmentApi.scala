package controllers.api

import javax.inject.{Inject, Singleton}

import db.{AccountDto, AssessmentDto, OrderDto}
import models.frontend.{OrderAndItsScores, FrontendOrder}
import models.{Assessment, AssessmentReportScores}
import play.api.Logger
import play.api.libs.json._
import play.api.mvc.{Action, Controller}
import services._

@Singleton
class AssessmentApi @Inject()(val accountDto: AccountDto, val assessmentDto: AssessmentDto, val orderDto: OrderDto) extends Controller {
  def save() = Action(parse.json) { request =>
    SessionService.getAccountId(request.session) match {
      case None => Unauthorized
      case Some(accountId) => accountDto.getOfId(accountId) match {
        case None => BadRequest("No account found in DB for ID " + accountId)
        case Some(account) =>
          request.body.validate[Assessment] match {
            case e: JsError => BadRequest("Validation of Assessment failed")

            case s: JsSuccess[Assessment] =>
              val assessment = s.get

              assessmentDto.deleteOfOrderId(assessment.orderId)
              assessmentDto.createAssessment(assessment)
              Ok
          }
      }
    }
  }

  def scoresOfCustomers() = Action(parse.json) { request =>
    SessionService.getAccountId(request.session) match {
      case None => Unauthorized
      case Some(accountId) => accountDto.getOfId(accountId) match {
        case None => BadRequest("No account found in DB for ID " + accountId)
        case Some(account) =>

          request.body.validate[List[Long]] match {
            case e: JsError => BadRequest("Validation of Customer IDs failed")

            case s: JsSuccess[List[Long]] =>
              val customerIds = s.get

              // Because "No Json serializer found for type Map[Long, List[OrderAndItsScores]]"
              var customerIdsAndTheirOrdersAndScores: Map[String, List[OrderAndItsScores]] = Map()

              for (id <- customerIds) {
                val ordersAndScores = orderDto.getOrdersFromCustomerWithReportSent(id).map { order =>
                  OrderAndItsScores(
                    order = order,
                    scores = assessmentDto.getScoresOfOrderId(order.id)
                  )
                }

                customerIdsAndTheirOrdersAndScores += (id.toString -> ordersAndScores)
              }

              Ok(Json.toJson(customerIdsAndTheirOrdersAndScores))
          }
      }
    }
  }
}
