package services

import play.api.Play
import play.api.Play.current

object GlobalConfig {
  val applicationSecret = Play.configuration.getString("play.crypto.secret").get
  val paymentCurrencyCode = Play.configuration.getString("payment.currencyCode").get
  val supportedLanguages = Play.configuration.getStringList("play.i18n.langs").get
  val rootUrl = Play.configuration.getString("rootUrl").get
}
