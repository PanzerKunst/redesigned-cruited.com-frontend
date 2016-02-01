package services

import com.paymill.context.PaymillContext
import play.api.Play
import play.api.Play.current

object PaymillService {
  val paymillAccountEmailAddress = Play.configuration.getString("paymill.account.emailAddress").get
  val paymillAccountPrivateKey = Play.configuration.getString("paymill.account.privateKey").get
  val paymentTransactionName = Play.configuration.getString("payment.transactionName").get

  val transactionService = new PaymillContext(paymillAccountPrivateKey).getTransactionService

  def doPayment(token: String, amount: Double) {
    val currencyCode = GlobalConfig.paymentCurrencyCode
    val currencyCodesWhereAmountIsMultipliedBy100 = List("USD", "EUR")

    val amountForApi = if(currencyCodesWhereAmountIsMultipliedBy100.contains(currencyCode)) {
      (amount * 100).toInt
    } else {
      amount.toInt
    }

    transactionService.createWithToken(
      token,
      amountForApi,
      currencyCode,
      paymentTransactionName
    )
  }
}
