package services

import java.util.Calendar
import java.util.concurrent.{ScheduledThreadPoolExecutor, TimeUnit}
import javax.inject.{Inject, Singleton}

import db.OrderDto
import models.Order
import play.api.Logger
import play.api.i18n.MessagesApi

@Singleton
class Scheduler @Inject()(orderDto: OrderDto, emailService: EmailService, messagesApi: MessagesApi, config: GlobalConfig) {
  // 1 thread
  val ex = new ScheduledThreadPoolExecutor(1)

  val task = new Runnable {
    def run() = {
      try {
        calculateOrdersSentToTheCustomer()
        orderDto.calculateOrdersToDo()
        handleScheduledAssessementsArrivedToTerm()
      } catch {
        case t: Throwable => Logger.error(t.getMessage, t)
      }
    }
  }

  private def calculateOrdersSentToTheCustomer() {
    val now = Calendar.getInstance()

    val from = Calendar.getInstance()
    from.clear()
    from.set(Calendar.YEAR, now.get(Calendar.YEAR))
    from.set(Calendar.MONTH, now.get(Calendar.MONTH))

    val to = Calendar.getInstance()
    to.setTime(from.getTime)
    to.add(Calendar.MONTH, 1)

    orderDto.calculateOrdersSentToTheCustomer(from.getTime, to.getTime)
  }

  private def handleScheduledAssessementsArrivedToTerm() {
    for (order <- orderDto.getScheduledOrdersArrivedToTerm) {
      updateOrderStatusToCompleted(order)
      sendReportAvailableEmail(order)
    }
  }

  private def updateOrderStatusToCompleted(order: Order) {
    val orderWithStatusComplete = order.copy(
      status = Order.statusIdComplete
    )

    orderDto.update(orderWithStatusComplete)
  }

  private def sendReportAvailableEmail(order: Order) {
    val customer = order.customer
    val languageCode = customer.languageCode

    emailService.sendReportAvailableEmail(
      customer.emailAddress,
      languageCode,
      SessionService.getI18nMessagesFromCode(languageCode, messagesApi)("email.reportAvailable.subject"),
      customer.firstName,
      config.customerAppRootUrl + "reports/" + order.id
    )
  }

  // Starts after 5 seconds, every 10s
  ex.scheduleAtFixedRate(task, 5, 10, TimeUnit.SECONDS)
}
