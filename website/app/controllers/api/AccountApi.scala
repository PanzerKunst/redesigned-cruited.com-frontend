package controllers.api

import javax.inject.Singleton

import db.{AccountDto, OrderDto}
import models.frontend.AccountReceivedFromFrontend
import play.api.libs.json.{JsError, JsSuccess, JsValue}
import play.api.mvc.{Action, Controller, Request}
import services.{HttpService, SessionService}

@Singleton
class AccountApi extends Controller {
  def create = Action(parse.json) { request =>
    request.body.validate[AccountReceivedFromFrontend] match {
      case e: JsError => BadRequest("Validation of AccountReceivedFromFrontend failed")

      case s: JsSuccess[AccountReceivedFromFrontend] =>
        val frontendAccount = s.get

        val accountWithSameEmailAddressOpt = AccountDto.getOfEmailAddress(frontendAccount.emailAddress)
        val accountIdInSession = SessionService.getAccountId(request.session)
        if (accountWithSameEmailAddressOpt.isDefined && accountIdInSession.isDefined && accountWithSameEmailAddressOpt.get.id != accountIdInSession.get) {
          Status(HttpService.httpStatusEmailAlreadyRegistered)
        } else {
          val accountWithSameLinkedinIdOpt = frontendAccount.linkedinProfile match {
            case None => None
            case Some(linkedinProfile) => AccountDto.getOfLinkedinAccountId((linkedinProfile \ "id").as[String])
          }

          if (accountWithSameLinkedinIdOpt.isDefined && accountIdInSession.isDefined && accountWithSameLinkedinIdOpt.get.id != accountIdInSession.get) {
            Status(HttpService.httpStatusLinkedinAccountIdAlreadyRegistered)
          } else {
            val newAccountId = createAccountAndUpdateOrder(frontendAccount, request)

            if (accountIdInSession.isDefined) {
              val accountId = accountIdInSession.get

              AccountDto.getOfId(accountId) match {
                case None =>

                // If exists in DB
                case Some(account) =>
                  // 1. If the old one has linkedIn info that the new one doesn't, we set it
                  if (account.linkedinProfile.isDefined) {
                    val newAccount = AccountDto.getOfId(newAccountId).get

                    if (!newAccount.linkedinProfile.isDefined) {
                      val updatedAccount = newAccount.copy(
                        linkedinProfile = account.linkedinProfile
                      )
                      AccountDto.update(updatedAccount)
                    }
                  }

                  // 2. We delete the old account
                  AccountDto.deleteOfId(accountId)
              }
            }

            // TODO: send welcome email

            Created.withSession(request.session + (SessionService.SESSION_KEY_ACCOUNT_ID -> newAccountId.toString))
          }
        }
    }
  }

  private def createAccountAndUpdateOrder(frontendAccount: AccountReceivedFromFrontend, request: Request[JsValue]): Long = {
    AccountDto.create(frontendAccount.emailAddress, frontendAccount.firstName, frontendAccount.password, frontendAccount.linkedinProfile) match {
      case None => throw new Exception("AccountDto.create() didn't return an ID")
      case Some(accountId) =>
        // In case there is an order ID in session, we update the order.added_by
        SessionService.getOrderId(request.session) match {
          case None =>
          case Some(tempOrderId) =>
            val orderWithUpdatedAccountId = OrderDto.getOfId(tempOrderId).get.copy(accountId = Some(accountId))
            OrderDto.update(orderWithUpdatedAccountId)
        }

        accountId
    }
  }
}
