package services

import play.Play
import play.api.Logger
import play.api.Play.current
import play.api.libs.mailer.{Email, MailerPlugin}

object EmailService {
  val accountAddress = Play.application().configuration().getString("smtp.user")
  val accountName = Play.application().configuration().getString("smtp.account.name")

  def sendAccountDataUpdatedEmail(emailAddress: String, resetPasswordUrl: String, firstName: String, subjecte: String) {
    val body = views.html.email.resetPassword(resetPasswordUrl, firstName).toString()

    // TODO: remove
    Logger.info("Email body: " + body)

    /* TODO: commented because of bug http://stackoverflow.com/questions/32861731/nosuchelementexception-in-play-framework-while-sending-email
    MailerPlugin.send(Email(
      subject = subjecte,
      from = accountName + " <" + accountAddress + ">",
      to = Seq(emailAddress),
      bodyHtml = Some(body),
      cc = Seq(),
      bcc = Seq(),
      attachments = Seq(),
      headers = Seq()
    )) */
  }
}
