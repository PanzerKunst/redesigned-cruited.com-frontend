package services

import com.paymill.context.PaymillContext
import play.api.Play
import play.api.Play.current

object PaymillService {
  val paymillAccountEmailAddress = Play.configuration.getString("paymill.account.emailAddress").get
  val paymillAccountPrivateKey = Play.configuration.getString("paymill.account.privateKey").get

  val transactionService = new PaymillContext(paymillAccountPrivateKey).getTransactionService

  def doPayment(token: String, amount: Double, currencyCode: String) {
    transactionService.createWithToken(
      token,
      (amount * 100).toInt,
      GlobalConfig.currencyCode,
      "Cruited granskning"
    )
  }
}
