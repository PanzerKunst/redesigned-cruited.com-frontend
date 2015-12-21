package services

import java.util.TimerTask
import javax.inject.{Inject, Singleton}

import db.{AccountDto, OrderDto}
import play.api.i18n.{I18nSupport, Messages, MessagesApi}

@Singleton
class EmailsToSendTasker @Inject()(val messagesApi: MessagesApi, val emailService: EmailService) extends TimerTask with I18nSupport {
  var isRunning = false

  def run() {
    if (!isRunning) {
      isRunning = true

      // Retrieve the finalised orders which have status "not paid", and a creation date > 1 day, and 1day_email_sent = 0
      for ((emailAddress, firstName, orderId) <- AccountDto.getWhoNeedUnpaidOrderReminderEmail) {
        val paymentUrl = "/order/complete-payment?orderId=" + orderId

        emailService.sendUnpaidOrderReminderEmail(emailAddress, firstName, paymentUrl, Messages("email.unpaidOrderReminder.subject"))
        OrderDto.setUnpaidOrderReminderEmailSent(orderId)
      }


      // Retrieve the finalised orders which have status "assessment complete", and "set_done_at" > 2 days, and 2days_after_assessment_delivered_email_sent = 0
      for ((emailAddress, firstName, orderId) <- AccountDto.getWhoNeedTheTwoDaysAfterAssessmentDeliveredEmail) {
        emailService.sendTheTwoDaysAfterAssessmentDeliveredEmail(emailAddress, firstName, Messages("email.twoDaysAfterAssessmentDelivered.subject"))
        OrderDto.setTwoDaysAfterAssessmentDeliveredEmailSent(orderId)
      }

      isRunning = false
    }
  }
}
