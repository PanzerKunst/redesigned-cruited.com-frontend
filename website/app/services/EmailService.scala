package services

import javax.inject.{Inject, Singleton}

import play.Play
import play.api.libs.mailer.{Email, MailerClient}

@Singleton
class EmailService @Inject()(mailerClient: MailerClient) {
  val accountAddress = Play.application().configuration().getString("play.mailer.user")
  val accountName = Play.application().configuration().getString("play.mailer.account.name")

  def sendResetPasswordEmail(emailAddress: String, resetPasswordUrl: String, firstName: String, subject: String) {
    mailerClient.send(Email(
      subject,
      accountName + "<" + accountAddress + ">",
      Seq(emailAddress),
      bodyHtml = Some(views.html.email.resetPassword(resetPasswordUrl, firstName).toString())
    ))
  }
}
