package controllers.api

import java.util.UUID
import javax.inject.{Inject, Singleton}

import db.{AccountDto, OrderDto}
import models.frontend.SignInData
import play.api.i18n.MessagesApi
import play.api.libs.json._
import play.api.mvc.{Action, Controller}
import services._

@Singleton
class AuthApi @Inject()(val messagesApi: MessagesApi, val emailService: EmailService, val orderService: OrderService) extends Controller {
  def signInWithEmail() = Action(parse.json) { request =>
    request.body.validate[SignInData] match {
      case _: JsError => BadRequest("Validation of SignInData failed")

      case s: JsSuccess[SignInData] =>
        val signInData = s.get

        AccountDto.getOfEmailAddress(signInData.emailAddress) match {
          case None => NoContent // Email not registered
          case Some(account) =>
            if (account.password.isEmpty) {
              Status(HttpService.httpStatusSignInNoPassword)
            } else {
              AccountDto.getOfEmailAndPassword(signInData.emailAddress, signInData.password) match {
                case None =>
                  if (account.linkedinProfile == JsNull) {
                    Status(HttpService.httpStatusSignInPasswordMismatchLinkedinNotRegistered)
                  } else {
                    Status(HttpService.httpStatusSignInPasswordMismatchLinkedinRegistered)
                  }
                case Some(acc) =>
                  val accountId = acc.id

                  if (request.queryString.contains("isFromAccountCreation")) {
                    // We finalise the order
                    val orderId = SessionService.getOrderId(request.session).get
                    val orderToFinalise = OrderDto.getOfId(orderId).get.copy(
                      accountId = Some(accountId)
                    )
                    val finalisedOrderId = orderService.finaliseOrder(orderToFinalise)

                    // sign in the user, then back on the client-side we show the "you are now logged-in" view.
                    Ok(Json.toJson(acc))
                      .withSession(request.session + (SessionService.sessionKeyAccountId -> accountId.toString)
                      + (SessionService.sessionKeyOrderId -> finalisedOrderId.toString))
                  } else {
                    Ok(Json.toJson(acc))
                      .withSession(request.session + (SessionService.sessionKeyAccountId -> accountId.toString))
                  }
              }
            }
        }
    }
  }

  def sendResetPasswordEmail() = Action { request =>
    request.body.asText match {
      case None => BadRequest("Request body must contain email address")
      case Some(emailAddress) =>
        AccountDto.getOfEmailAddress(emailAddress) match {
          case None => NoContent
          case Some(account) =>
            val token = UUID.randomUUID.toString
            val resetPasswordUrl = GlobalConfig.rootUrl + "reset-password/confirm?token=" + token

            AccountService.resetPasswordTokens += (token -> account.id)

            val i18nMessages = I18nService.getMessages(messagesApi, account.languageCode)

            emailService.sendResetPasswordEmail(emailAddress, account.firstName.get, account.languageCode, resetPasswordUrl, i18nMessages("email.resetPassword.subject"))

            Ok
        }
    }
  }
}
