package services

import com.paymill.context.PaymillContext
import play.api.Play
import play.api.Play.current

object PaymillService {
  val paymillAccountEmailAddress = Play.configuration.getString("paymill.account.emailAddress").get
  val paymillAccountPrivateKey = Play.configuration.getString("paymill.account.privateKey").get
  val paymentTransactionName = Play.configuration.getString("payment.transactionName").get

  val transactionService = new PaymillContext(paymillAccountPrivateKey).getTransactionService

  def doPayment(token: String, amount: Int) {
    val currencyCode = GlobalConfig.paymentCurrencyCode
    val currencyCodesWhereAmountIsMultipliedBy100 = List("USD", "EUR")

    val transactionAmount = if(currencyCodesWhereAmountIsMultipliedBy100.contains(currencyCode)) {
      amount * 100
    } else {
      amount
    }

    transactionService.createWithToken(
      token,
      transactionAmount,
      currencyCode,
      paymentTransactionName
    )
  }
}
