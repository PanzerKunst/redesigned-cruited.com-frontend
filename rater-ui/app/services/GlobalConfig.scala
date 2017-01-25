package services

import javax.inject.{Inject, Singleton}

import play.api.libs.functional.syntax._
import play.api.libs.json.{JsPath, Writes}

@Singleton
class GlobalConfig @Inject()(config: play.api.Configuration) {
  val paymentCurrencyCode = "SEK"
  val rootUrl = config.getString("rootUrl").get
  val dwsRootUrl = config.getString("dws.rootUrl").get
  val customerAppRootUrl = config.getString("customerApp.rootUrl").get
  val nbLastAssessmentsToTakeIntoAccount = config.getInt("averageScore.nbLastAssessmentsToTakeIntoAccount").get
  val emailAccountAddress = config.getString("play.mailer.user").get
  val emailAccountName = config.getString("play.mailer.account.name").get

  val serialized = SerializableConfig(
    paymentCurrencyCode,
    rootUrl,
    dwsRootUrl,
    customerAppRootUrl,
    nbLastAssessmentsToTakeIntoAccount,
    emailAccountAddress,
    emailAccountName
  )
}

case class SerializableConfig(paymentCurrencyCode: String,
                              rootUrl: String,
                              dwsRootUrl: String,
                              customerAppRootUrl: String,
                              nbLastAssessmentsToTakeIntoAccount: Int,
                              emailAccountAddress: String,
                              emailAccountName: String)

object SerializableConfig {
  implicit val writes: Writes[SerializableConfig] = (
    (JsPath \ "paymentCurrencyCode").write[String] and
      (JsPath \ "rootUrl").write[String] and
      (JsPath \ "dwsRootUrl").write[String] and
      (JsPath \ "customerAppRootUrl").write[String] and
      (JsPath \ "nbLastAssessmentsToTakeIntoAccount").write[Int] and
      (JsPath \ "emailAccountAddress").write[String] and
      (JsPath \ "emailAccountName").write[String]
    )(unlift(SerializableConfig.unapply))
}
