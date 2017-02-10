package controllers.api

import java.util.Date
import javax.inject.{Inject, Singleton}

import db.{AccountDto, OrderDto}
import models.frontend.{FrontendOrder, OrderSearchData}
import models.{Account, Order}
import play.api.libs.json._
import play.api.mvc.{Action, Controller}
import services._

@Singleton
class OrderApi @Inject()(val accountDto: AccountDto, val orderDto: OrderDto) extends Controller {
  def myToDo = Action { request =>
    SessionService.getAccountId(request.session) match {
      case None => Unauthorized
      case Some(accountId) => accountDto.getOfId(accountId) match {
        case None => BadRequest("No account found in DB for ID " + accountId)
        case Some(account) =>
          val ordersPaidOrInProgressAssignedToMe = orderDto.getOrdersPaidOrInProgressAssignedTo(accountId)

          val ordersAwaitingFeedback = if (account.`type` == Account.typeAdmin) {
            orderDto.getOrdersOfStatus(Order.statusIdAwaitingFeedback)
          } else {
            List()
          }

          Ok(Json.toJson(ordersPaidOrInProgressAssignedToMe ++ ordersAwaitingFeedback))
      }
    }
  }

  def team = Action(parse.json) { request =>
    SessionService.getAccountId(request.session) match {
      case None => Unauthorized
      case Some(accountId) => accountDto.getOfId(accountId) match {
        case None => BadRequest("No account found in DB for ID " + accountId)
        case Some(account) =>
          request.body.validate[List[Long]] match {
            case e: JsError => BadRequest("Validation of List[Long] failed")

            case s: JsSuccess[List[Long]] =>
              val excludedOrderIds = s.get

              val unassignedPaidOrders = orderDto.getUnassignedPaidOrders
              val assignedPaidOrders = orderDto.getAssignedPaidOrdersExcept(excludedOrderIds)
              val ordersInProgress = orderDto.getOrdersOfStatus(Order.statusIdInProgress, excludedOrderIds)

              val ordersAwaitingFeedback = if (account.`type` == Account.typeAdmin) {
                List()
              } else {
                orderDto.getOrdersOfStatus(Order.statusIdAwaitingFeedback)
              }

              val scheduledOrders = orderDto.getOrdersOfStatus(Order.statusIdScheduled)

              Ok(Json.toJson(unassignedPaidOrders ++ assignedPaidOrders ++ ordersInProgress ++ ordersAwaitingFeedback ++ scheduledOrders))
          }
      }
    }
  }

  def completed = Action(parse.json) { request =>
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

              val completedOrdersExcept = orderDto.getCompletedOrders(fromOpt, to)

              Ok(Json.toJson(completedOrdersExcept))
          }
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
}
