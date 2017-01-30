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

  def delete(id: Long) = Action { request =>
    SessionService.getAccountId(request.session) match {
      case None => Unauthorized
      case Some(accountId) => accountDto.getOfId(accountId) match {
        case None => BadRequest("No account found in DB for ID " + accountId)
        case Some(account) =>
          orderDto.updateAsDeleted(id)
          Ok
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
              val fromOpt = orderSearchData.from match {
                case None => None
                case Some(ts) => Some(new Date(ts))
              }
              val to = new Date(orderSearchData.to)

              val olderOrdersExcept = orderDto.getOlderOrdersExcept(fromOpt, to, orderSearchData.excludedOrderIds).sortWith(sortOrderByStatus)

              Ok(Json.toJson(olderOrdersExcept))
          }
      }
    }
  }

  def sentToTheCustomerThisMonth() = Action { request =>
    SessionService.getAccountId(request.session) match {
      case None => Unauthorized
      case Some(accountId) => accountDto.getOfId(accountId) match {
        case None => BadRequest("No account found in DB for ID " + accountId)
        case Some(account) => Ok(Json.toJson(orderDto.ordersSentToTheCustomer))
      }
    }
  }

  def toDo() = Action { request =>
    SessionService.getAccountId(request.session) match {
      case None => Unauthorized
      case Some(accountId) => accountDto.getOfId(accountId) match {
        case None => BadRequest("No account found in DB for ID " + accountId)
        case Some(account) => Ok(Json.toJson(orderDto.ordersToDo))
      }
    }
  }

  private def sortOrderByStatus(o1: FrontendOrder, o2: FrontendOrder): Boolean = {
    val s1 = o1.status
    val s2 = o2.status

    if (s1 == s2) {
      o1.id > o2.id
    } else if (o1.status == Order.statusIdComplete) {
      false
    } else if (o1.status == Order.statusIdScheduled && o2.status != Order.statusIdComplete) {
      false
    } else if (o1.status == Order.statusIdAwaitingFeedback && o2.status != Order.statusIdComplete && o2.status != Order.statusIdScheduled) {
      false
    } else if (o1.status == Order.statusIdInProgress && (o2.status == Order.statusIdPaid || o2.status != Order.statusIdNotPaid)) {
      false
    } else if (o1.status == Order.statusIdPaid && o2.status != Order.statusIdNotPaid) {
      false
    } else {
      true
    }
  }
}
