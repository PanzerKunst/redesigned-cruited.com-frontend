package services

import java.util.TimerTask
import javax.inject.{Inject, Singleton}

import db.{AccountDto, OrderDto}
import play.api.i18n.{I18nSupport, MessagesApi}

@Singleton
class EmailsToSendTasker @Inject()(val messagesApi: MessagesApi, val emailService: EmailService) extends TimerTask {
  var isRunning = false

  def run() {
    if (!isRunning) {
      isRunning = true

      // Retrieve the finalised orders which have status "not paid", and a creation date > 1 day, and 1day_email_sent = 0
      for ((emailAddress, firstName, languageCode, orderId) <- AccountDto.getWhoNeedUnpaidOrderReminderEmail) {
        val paymentUrl = GlobalConfig.rootUrl + "order/complete-payment?orderId=" + orderId
        val i18nMessages = I18nService.getMessages(messagesApi, languageCode)

        emailService.sendUnpaidOrderReminderEmail(emailAddress, firstName, languageCode, paymentUrl, i18nMessages("email.unpaidOrderReminder.subject"))
        OrderDto.setUnpaidOrderReminderEmailSent(orderId)
      }


      // Retrieve the finalised orders which have status "assessment complete", and "set_done_at" > 2 days, and 2days_after_assessment_delivered_email_sent = 0
      for ((emailAddress, firstName, languageCode, orderId) <- AccountDto.getWhoNeedTheTwoDaysAfterAssessmentDeliveredEmail) {
        val i18nMessages = I18nService.getMessages(messagesApi, languageCode)

        emailService.sendTheTwoDaysAfterAssessmentDeliveredEmail(emailAddress, firstName, languageCode, i18nMessages("email.twoDaysAfterAssessmentDelivered.subject"))
        OrderDto.setTwoDaysAfterAssessmentDeliveredEmailSent(orderId)
      }

      isRunning = false
    }
  }
}
