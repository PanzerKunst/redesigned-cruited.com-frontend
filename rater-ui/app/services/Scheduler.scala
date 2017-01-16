package services

import java.util.Calendar
import java.util.concurrent.{ScheduledThreadPoolExecutor, TimeUnit}
import javax.inject.{Inject, Singleton}

import db.OrderDto

@Singleton
class Scheduler @Inject()(orderDto: OrderDto) {
  // 1 thread
  val ex = new ScheduledThreadPoolExecutor(1)

  val task = new Runnable {
    def run() = {
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
  }

  // Starts immediately, every 10 seconds
  ex.scheduleAtFixedRate(task, 0, 10, TimeUnit.SECONDS)
}
