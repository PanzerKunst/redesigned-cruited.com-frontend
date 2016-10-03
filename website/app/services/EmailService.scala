package services

import javax.inject.{Inject, Singleton}

import play.Play
import play.api.Logger
import play.api.libs.mailer.{Email, MailerClient}

@Singleton
class EmailService @Inject()(val mailerClient: MailerClient) {
  val accountAddress = Play.application().configuration().getString("play.mailer.user")
  val accountName = Play.application().configuration().getString("play.mailer.account.name")

  val accountAddressErik = Play.application().configuration().getString("play.mailer.forsandree.user")
  val accountNameErik = Play.application().configuration().getString("play.mailer.forsandree.account.name")

  def sendResetPasswordEmail(emailAddress: String, firstName: String, languageCode: String, resetPasswordUrl: String, subject: String) {
    val view = if (languageCode == "en") {
      views.html.email.en.resetPassword(firstName, resetPasswordUrl)
    } else {
      views.html.email.sv.resetPassword(firstName, resetPasswordUrl)
    }

    mailerClient.send(Email(
      subject,
      accountName + "<" + accountAddress + ">",
      Seq(emailAddress),
      bodyHtml = Some(view.toString())
    ))

    Logger.info("Sent ResetPasswordEmail to " + emailAddress)
  }

  def sendFreeOrderCompleteEmail(emailAddress: String, firstName: String, languageCode: String, subject: String) {
    val view = if (languageCode == "en") {
      views.html.email.en.orderComplete.free(firstName)
    } else {
      views.html.email.sv.orderComplete.free(firstName)
    }

    mailerClient.send(Email(
      subject,
      accountName + "<" + accountAddress + ">",
      Seq(emailAddress),
      bodyHtml = Some(view.toString)
    ))

    Logger.info("Sent FreeOrderCompleteEmail to " + emailAddress)
  }

  def sendPaidOrderCompleteEmail(emailAddress: String, firstName: String, languageCode: String, orderedProducts: String, orderId: Long, costAfterReductions: Int, vatAmount: Double, orderDateTime: String, subject: String) {
    val view = if (languageCode == "en") {
      views.html.email.en.orderComplete.paid(firstName, emailAddress, orderedProducts, orderId, costAfterReductions, GlobalConfig.paymentCurrencyCode, vatAmount, orderDateTime)
    } else {
      views.html.email.sv.orderComplete.paid(firstName, emailAddress, orderedProducts, orderId, costAfterReductions, GlobalConfig.paymentCurrencyCode, vatAmount, orderDateTime)
    }

    mailerClient.send(Email(
      subject,
      accountName + "<" + accountAddress + ">",
      Seq(emailAddress),
      bodyHtml = Some(view.toString())
    ))

    Logger.info("Sent PaidOrderCompleteEmail to " + emailAddress)
  }

  def sendUnpaidOrderReminderEmail(emailAddress: String, firstName: String, languageCode: String, paymentUrl: String, subject: String) = {
    val view = if (languageCode == "en") {
      views.html.email.en.unpaidOrderReminder(firstName, paymentUrl)
    } else {
      views.html.email.sv.unpaidOrderReminder(firstName, paymentUrl)
    }

    mailerClient.send(Email(
      subject,
      accountName + "<" + accountAddress + ">",
      Seq(emailAddress),
      bodyHtml = Some(view.toString())
    ))

    Logger.info("Sent UnpaidOrderReminderEmail to " + emailAddress)
  }

  def sendTheTwoDaysAfterAssessmentDeliveredEmail(emailAddress: String, firstName: String, languageCode: String, subject: String) = {
    val view = if (languageCode == "en") {
      views.html.email.en.twoDaysAfterAssessmentDelivered(firstName)
    } else {
      views.html.email.sv.twoDaysAfterAssessmentDelivered(firstName)
    }

    mailerClient.send(Email(
      subject,
      accountNameErik + "<" + accountAddressErik + ">",
      Seq(emailAddress),
      bodyHtml = Some(view.toString)
    ))

    Logger.info("Sent the TwoDaysAfterAssessmentDeliveredEmail to " + emailAddress)
  }
}
