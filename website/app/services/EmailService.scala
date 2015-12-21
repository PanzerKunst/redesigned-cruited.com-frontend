package services

import javax.inject.{Inject, Singleton}

import play.Play
import play.api.libs.mailer.{Email, MailerClient}

@Singleton
class EmailService @Inject()(val mailerClient: MailerClient) {
  val accountAddress = Play.application().configuration().getString("play.mailer.user")
  val accountName = Play.application().configuration().getString("play.mailer.account.name")

  def sendResetPasswordEmail(emailAddress: String, firstName: String, resetPasswordUrl: String, subject: String) {
    mailerClient.send(Email(
      subject,
      accountName + "<" + accountAddress + ">",
      Seq(emailAddress),
      bodyHtml = Some(views.html.email.resetPassword(firstName, resetPasswordUrl).toString())
    ))
  }

  def sendOrderCompleteEmail(emailAddress: String, firstName: String, subject: String) {
    mailerClient.send(Email(
      subject,
      accountName + "<" + accountAddress + ">",
      Seq(emailAddress),
      bodyHtml = Some(views.html.email.orderComplete(firstName).toString())
    ))
  }

  def sendUnpaidOrderReminderEmail(emailAddress: String, firstName: String, paymentUrl: String, subject: String) = {
    mailerClient.send(Email(
      subject,
      accountName + "<" + accountAddress + ">",
      Seq(emailAddress),
      bodyHtml = Some(views.html.email.unpaidOrderReminder(firstName, paymentUrl).toString())
    ))
  }

  def sendTheTwoDaysAfterAssessmentDeliveredEmail(emailAddress: String, firstName: String, subject: String) = {
    mailerClient.send(Email(
      subject,
      accountName + "<" + accountAddress + ">",
      Seq(emailAddress),
      bodyHtml = Some(views.html.email.twoDaysAfterAssessmentDelivered(firstName).toString())
    ))
  }
}
