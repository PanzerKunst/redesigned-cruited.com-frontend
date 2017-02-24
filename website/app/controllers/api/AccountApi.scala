package controllers.api

import javax.inject.{Inject, Singleton}

import db.{AccountDto, OrderDto}
import models.frontend.AccountReceivedFromFrontend
import play.api.libs.json._
import play.api.mvc.{Action, Controller}
import services._

@Singleton
class AccountApi @Inject()(val orderService: OrderService) extends Controller {
  def create() = Action(parse.json) { request =>
    request.body.validate[AccountReceivedFromFrontend] match {
      case _: JsError => BadRequest("Validation of AccountReceivedFromFrontend failed")

      case s: JsSuccess[AccountReceivedFromFrontend] =>
        val frontendAccount = s.get

        val accountWithSameEmailAddressOpt = AccountDto.getOfEmailAddress(frontendAccount.emailAddress)
        if (accountWithSameEmailAddressOpt.isDefined) {
          Status(HttpService.httpStatusEmailAlreadyRegistered)
        } else {
          val finalisedAccountId = AccountService.finaliseAccount(frontendAccount.emailAddress, frontendAccount.firstName, frontendAccount.password, JsNull, request.session)

          // then finalize the order. The accountId is already the finalised account ID
          val orderId = SessionService.getOrderId(request.session).get
          val finalisedOrderId = orderService.finaliseOrder(OrderDto.getOfId(orderId).get)

          // then log the user in. The JS controller should then redirect to "/payment"
          Created.withSession(request.session + (SessionService.SessionKeyAccountId -> finalisedAccountId.toString)
            + (SessionService.SessionKeyOrderId -> finalisedOrderId.toString))
        }
    }
  }

  def update() = Action(parse.json) { request =>
    SessionService.getAccountId(request.session) match {
      case None => Unauthorized(views.html.unauthorised())
      case Some(accountId) => AccountDto.getOfId(accountId) match {
        case None => BadRequest("No account found in DB for ID " + accountId)
        case Some(account) =>
          request.body.validate[AccountReceivedFromFrontend] match {
            case _: JsError => BadRequest("Validation of AccountReceivedFromFrontend failed")

            case s: JsSuccess[AccountReceivedFromFrontend] =>
              val frontendAccount = s.get

              val updatedPassword = if (frontendAccount.password.isDefined) {
                Some(frontendAccount.password.get)
              } else {
                account.password
              }

              val updatedAccount = account.copy(
                firstName = Some(frontendAccount.firstName),
                password = updatedPassword,
                languageCode = frontendAccount.languageCode.getOrElse(SessionService.getCurrentLanguage(request.session).ietfCode)
              )

              AccountDto.update(updatedAccount)

              Ok.withSession(request.session + (SessionService.SessionKeyAccountSaveSuccessful -> "true"))
          }
      }
    }
  }

  def updatePassword() = Action(parse.json) { request =>
    request.body.validate[AccountReceivedFromFrontend] match {
      case _: JsError => BadRequest("Validation of AccountReceivedFromFrontend failed")

      case s: JsSuccess[AccountReceivedFromFrontend] =>
        val frontendAccount = s.get

        if (frontendAccount.password.isEmpty) {
          BadRequest("Field 'password' must be specified")
        } else {
          AccountDto.getOfEmailAddress(frontendAccount.emailAddress) match {
            case None => BadRequest("No account found in DB for email " + frontendAccount.emailAddress)
            case Some(account) =>
              val updatedAccount = account.copy(
                password = frontendAccount.password
              )

              AccountDto.update(updatedAccount)

              request.session.get(SessionService.SessionKeyResetPasswordToken) match {
                case None =>
                case Some(token) => AccountService.resetPasswordTokens -= token
              }

              Ok.withSession(request.session - SessionService.SessionKeyResetPasswordToken)
          }
        }
    }
  }
}
