package services

import com.paymill.context.PaymillContext
import models.Order
import play.api.{Logger, Play}
import play.api.Play.current

object PaymillService {
  val paymillAccountEmailAddress = Play.configuration.getString("paymill.account.emailAddress").get
  val paymillAccountPrivateKey = Play.configuration.getString("paymill.account.privateKey").get
  val paymentTransactionName = Play.configuration.getString("payment.transactionName").get

  val paymillResponseCodeSuccess = 20000
  val transactionService = new PaymillContext(paymillAccountPrivateKey).getTransactionService

  def doPayment(token: String, amount: Int, order: Order) {
    val transaction = transactionService.createWithToken(
      token,
      amount * 100,
      GlobalConfig.paymentCurrencyCode,
      paymentTransactionName + " " + order.id.get + "-" + order.accountId.get
    )

    val transactionResponseCode = transaction.getResponseCode
    val transactionResponseText = transaction.getResponseCodeDetail

    // See https://developers.paymill.com/API/index#response-codes
    Logger.info("Payment transaction completed: " + transactionResponseText + " (" + transactionResponseCode + ")")

    if (transactionResponseCode != paymillResponseCodeSuccess) {
      throw new PaymentException(transactionResponseText + " (" + transactionResponseCode + ")")
    }
  }
}

case class PaymentException(msg: String) extends Exception(msg)
