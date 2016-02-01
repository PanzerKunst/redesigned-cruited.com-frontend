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

  def sendFreeOrderCompleteEmail(emailAddress: String, firstName: String, subject: String) {
    mailerClient.send(Email(
      subject,
      accountName + "<" + accountAddress + ">",
      Seq(emailAddress),
      bodyHtml = Some(views.html.email.orderComplete.free(firstName).toString)
    ))
  }

  def sendPaidOrderCompleteEmail(emailAddress: String, firstName: String, orderedProducts: String, orderId: Long, costAfterReductions: Int, currencyCode: String, vatAmount: Double, orderDateTime: String, subject: String) {
    mailerClient.send(Email(
      subject,
      accountName + "<" + accountAddress + ">",
      Seq(emailAddress),
      bodyHtml = Some(views.html.email.orderComplete.paid(firstName, emailAddress, orderedProducts, orderId, costAfterReductions, currencyCode, vatAmount, orderDateTime).toString())
    ))
  }

  def sendUnpaidOrderReminderEmail(emailAddress: String, firstName: String, paymentUrl: String, subject: String) = {
    /* TODO mailerClient.send(Email(
      subject,
      accountName + "<" + accountAddress + ">",
      Seq(emailAddress),
      bodyHtml = Some(views.html.email.unpaidOrderReminder(firstName, paymentUrl).toString())
    )) */
  }

  def sendTheTwoDaysAfterAssessmentDeliveredEmail(emailAddress: String, firstName: String, subject: String) = {
    /* TODO mailerClient.send(Email(
      subject,
      accountName + "<" + accountAddress + ">",
      Seq(emailAddress),
      bodyHtml = Some(views.html.email.twoDaysAfterAssessmentDelivered(firstName).toString)
    )) */
  }
}
