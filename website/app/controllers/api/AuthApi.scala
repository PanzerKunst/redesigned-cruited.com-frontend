package controllers.api

import java.util.UUID
import javax.inject.{Inject, Singleton}

import db.AccountDto
import models.frontend.SignInData
import play.api.Play
import play.api.Play.current
import play.api.i18n.{I18nSupport, Messages, MessagesApi}
import play.api.libs.json._
import play.api.mvc.{Action, Controller}
import services.{AccountService, EmailService, SessionService}

@Singleton
class AuthApi @Inject()(val messagesApi: MessagesApi, val emailService: EmailService) extends Controller with I18nSupport {
  val rootUrl = Play.configuration.getString("rootUrl").get

  def signIn = Action(parse.json) { request =>
    request.body.validate[SignInData] match {
      case e: JsError => BadRequest("Validation of SignInData failed")

      case s: JsSuccess[SignInData] =>
        val signInData = s.get

        AccountDto.getOfEmailAndPassword(signInData.emailAddress, signInData.password) match {
          case None => NoContent
          case Some(account) => Ok.withSession(request.session + (SessionService.sessionKeyAccountId -> account.id.toString))
        }
    }
  }

  def sendResetPasswordEmail = Action { request =>
    request.body.asText match {
      case None => BadRequest("Request body must contain email address")
      case Some(emailAddress) =>
        AccountDto.getOfEmailAddress(emailAddress) match {
          case None => NoContent
          case Some(account) =>
            val token = UUID.randomUUID.toString
            val resetPasswordUrl = rootUrl + "reset-password/confirm?token=" + token

            AccountService.resetPasswordTokens += (token -> account.id)

            emailService.sendResetPasswordEmail(emailAddress, resetPasswordUrl, account.firstName.get, Messages("resetPassword.email.subject"))

            Ok
        }
    }
  }
}
