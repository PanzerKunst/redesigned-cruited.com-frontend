package services

import java.util.Calendar
import java.util.concurrent.{ScheduledThreadPoolExecutor, TimeUnit}
import javax.inject.{Inject, Singleton}

import db.OrderDto
import models.Order
import play.api.i18n.MessagesApi

@Singleton
class Scheduler @Inject()(orderDto: OrderDto, emailService: EmailService, messagesApi: MessagesApi, config: GlobalConfig) {
  // 1 thread
  val ex = new ScheduledThreadPoolExecutor(1)

  val task = new Runnable {
    def run() = {
      calculateOrdersSentToTheCustomer()
      orderDto.calculateOrdersToDo()
      handleScheduledAssessementsArrivedToTerm()
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
      // TODO: uncomment when replacing Users app
      // updateOrderStatusToCompleted(order)

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
      SessionService.getI18nMessagesFromCode(languageCode, messagesApi).get("email.reportAvailable.subject").get,
      customer.firstName,
      config.customerAppRootUrl + "reports/" + order.id
    )
  }

  // Starts immediately, every 10 seconds
  ex.scheduleAtFixedRate(task, 0, 10, TimeUnit.SECONDS)
}
