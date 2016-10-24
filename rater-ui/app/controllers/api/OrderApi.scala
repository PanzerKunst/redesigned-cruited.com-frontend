package controllers.api

import java.util.Date
import javax.inject.{Inject, Singleton}

import db.{AccountDto, OrderDto}
import models.Order
import models.frontend.{FrontendOrder, OrderSearchData}
import play.api.libs.json._
import play.api.mvc.{Action, Controller}
import services._

@Singleton
class OrderApi @Inject()(val accountDto: AccountDto, val orderDto: OrderDto) extends Controller {
  def top = Action { request =>
    SessionService.getAccountId(request.session) match {
      case None => Unauthorized
      case Some(accountId) => accountDto.getOfId(accountId) match {
        case None => BadRequest("No account found in DB for ID " + accountId)
        case Some(account) =>
          val ordersToDisplayAtTheTop = orderDto.getActionableOrdersOfRaterId(accountId)
          Ok(Json.toJson(ordersToDisplayAtTheTop))
      }
    }
  }

  def update() = Action(parse.json) { request =>
    SessionService.getAccountId(request.session) match {
      case None => Unauthorized
      case Some(accountId) => accountDto.getOfId(accountId) match {
        case None => BadRequest("No account found in DB for ID " + accountId)
        case Some(account) =>
          request.body.validate[FrontendOrder] match {
            case e: JsError => BadRequest("Validation of FrontendOrder failed")

            case s: JsSuccess[FrontendOrder] =>
              orderDto.update(new Order(s.get))
              Ok
          }
      }
    }
  }

  def delete() = Action(parse.json) { request =>
    SessionService.getAccountId(request.session) match {
      case None => Unauthorized
      case Some(accountId) => accountDto.getOfId(accountId) match {
        case None => BadRequest("No account found in DB for ID " + accountId)
        case Some(account) =>
          request.body.validate[FrontendOrder] match {
            case e: JsError => BadRequest("Validation of FrontendOrder failed")

            case s: JsSuccess[FrontendOrder] =>
              orderDto.updateAsDeleted(new Order(s.get))
              Ok
          }
      }
    }
  }

  def search() = Action(parse.json) { request =>
    SessionService.getAccountId(request.session) match {
      case None => Unauthorized
      case Some(accountId) => accountDto.getOfId(accountId) match {
        case None => BadRequest("No account found in DB for ID " + accountId)
        case Some(account) =>
          request.body.validate[OrderSearchData] match {
            case e: JsError => BadRequest("Validation of OrderSearchData failed")

            case s: JsSuccess[OrderSearchData] =>
              val orderSearchData = s.get
              val fromDateOpt = orderSearchData.fromTimestamp match {
                case None => None
                case Some(ts) => Some(new Date(ts))
              }
              val toDate = new Date(orderSearchData.toTimestamp)

              val olderOrdersExcept = orderDto.getOlderOrdersExcept(fromDateOpt, toDate, orderSearchData.excludedOrderIds)

              Ok(Json.toJson(olderOrdersExcept))
          }
      }
    }
  }
}
