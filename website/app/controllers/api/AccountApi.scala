package controllers.api

import java.util.Date
import javax.inject.Singleton

import db.AccountDto
import models.Account
import models.frontend.AccountReceivedFromFrontend
import play.api.libs.json.{JsError, JsSuccess}
import play.api.mvc.{Action, Controller}
import services.{DocumentService, HttpService, SessionService}

@Singleton
class AccountApi extends Controller {
  def create = Action(parse.json) { request =>
    SessionService.getAccountId(request.session) match {
      case None => BadRequest("Account ID not found in session")

      case Some(accountId) =>
        request.body.validate[AccountReceivedFromFrontend] match {
          case e: JsError => BadRequest("Validation of AccountReceivedFromFrontend failed")

          case s: JsSuccess[AccountReceivedFromFrontend] =>
            val frontendAccount = s.get

            AccountDto.getOfEmailAddress(frontendAccount.emailAddress) match {
              case Some(accountWithSameEmail) => Status(HttpService.httpStatusEmailAlreadyRegistered)

              case None =>
                if (frontendAccount.linkedinAccountId.isDefined && AccountDto.getOfLinkedinAccountId(frontendAccount.linkedinAccountId.get).isDefined) {
                  Status(HttpService.httpStatusLinkedinAccountIdAlreadyRegistered)
                } else {
                  AccountDto.create(frontendAccount.emailAddress, frontendAccount.firstName, frontendAccount.password) match {
                    case None => throw new Exception("AccountDto.create() didn't return an ID")

                    case Some(newAccountId) =>
                      AccountDto.getOfId(accountId) match {
                        case None => throw new Exception("No account found in database for ID '" + accountId + "'")
                        case Some(oldAccount) =>
                          val newAccount = Account(
                            id = newAccountId,
                            firstName = Some(frontendAccount.firstName),
                            lastName = oldAccount.lastName,
                            emailAddress = Some(frontendAccount.emailAddress),
                            password = frontendAccount.password,
                            pictureUrl = oldAccount.pictureUrl,
                            linkedinAccountId = oldAccount.linkedinAccountId,
                            linkedinBasicProfile = oldAccount.linkedinBasicProfile,
                            creationTimestamp = new Date().getTime
                          )
                          AccountDto.update(newAccount)

                          DocumentService.renameAccountDir(accountId, newAccountId)

                          AccountDto.deleteOfId(accountId)

                          // TODO: send welcome email

                          Created.withSession(request.session + ("accountId" -> newAccountId.toString))
                      }
                  }
                }
            }
        }
    }
  }
}
