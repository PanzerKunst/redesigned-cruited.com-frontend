package services

import javax.inject.{Inject, Singleton}

import play.api.Logger
import play.api.libs.mailer.{Email, MailerClient}

@Singleton
class EmailService @Inject()(mailerClient: MailerClient, config: GlobalConfig) {
  def sendReportAvailableEmail(emailAddress: String, languageCode: String, subject: String, firstName: String, reportUrl: String) {
    val view = if (languageCode == I18nService.languageCodeEn) {
      views.html.email.en.reportAvailable(firstName, reportUrl)
    } else {
      views.html.email.sv.reportAvailable(firstName, reportUrl)
    }

    /* TODO: be careful before activating this piece of code!
    mailerClient.send(Email(
      subject,
      config.emailAccountName + " <" + config.emailAccountAddress + ">",
      Seq(emailAddress),
      bodyHtml = Some(view.toString)
    )) */

    Logger.info("Sent ReportAvailableEmail to " + emailAddress)
  }
}
