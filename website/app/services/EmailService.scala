package services

import javax.inject.{Inject, Singleton}

import play.Play
import play.api.Logger
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

    Logger.info("Sent ResetPasswordEmail to " + emailAddress)
  }

  def sendFreeOrderCompleteEmail(emailAddress: String, firstName: String, subject: String) {
    mailerClient.send(Email(
      subject,
      accountName + "<" + accountAddress + ">",
      Seq(emailAddress),
      bodyHtml = Some(views.html.email.orderComplete.free(firstName).toString)
    ))

    Logger.info("Sent FreeOrderCompleteEmail to " + emailAddress)
  }

  def sendPaidOrderCompleteEmail(emailAddress: String, firstName: String, orderedProducts: String, orderId: Long, costAfterReductions: Int, vatAmount: Double, orderDateTime: String, subject: String) {
    mailerClient.send(Email(
      subject,
      accountName + "<" + accountAddress + ">",
      Seq(emailAddress),
      bodyHtml = Some(views.html.email.orderComplete.paid(firstName, emailAddress, orderedProducts, orderId, costAfterReductions, GlobalConfig.paymentCurrencyCode, vatAmount, orderDateTime).toString())
    ))

    Logger.info("Sent PaidOrderCompleteEmail to " + emailAddress)
  }

  def sendUnpaidOrderReminderEmail(emailAddress: String, firstName: String, paymentUrl: String, subject: String) = {
    mailerClient.send(Email(
      subject,
      accountName + "<" + accountAddress + ">",
      Seq(emailAddress),
      bodyHtml = Some(views.html.email.unpaidOrderReminder(firstName, paymentUrl).toString())
    ))

    Logger.info("Sent UnpaidOrderReminderEmail to " + emailAddress)
  }

  def sendTheTwoDaysAfterAssessmentDeliveredEmail(emailAddress: String, firstName: String, subject: String) = {
    mailerClient.send(Email(
      subject,
      accountName + "<" + accountAddress + ">",
      Seq(emailAddress),
      bodyHtml = Some(views.html.email.twoDaysAfterAssessmentDelivered(firstName).toString)
    ))

    Logger.info("Sent the TwoDaysAfterAssessmentDeliveredEmail to " + emailAddress)
  }
}
