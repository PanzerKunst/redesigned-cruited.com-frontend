package services

import javax.inject.{Inject, Singleton}

import play.api.libs.functional.syntax._
import play.api.libs.json.{JsPath, Writes}

@Singleton
class GlobalConfig @Inject()(config: play.api.Configuration) {
  val paymentCurrencyCode = "SEK"
  val rootUrl = config.getString("rootUrl").get
  val dwsRootUrl = config.getString("dws.rootUrl").get

  val serialized = SerializableConfig(
    paymentCurrencyCode,
    rootUrl,
    dwsRootUrl
  )
}

case class SerializableConfig(paymentCurrencyCode: String,
                              rootUrl: String,
                              dwsRootUrl: String)

object SerializableConfig {
  implicit val writes: Writes[SerializableConfig] = (
    (JsPath \ "paymentCurrencyCode").write[String] and
      (JsPath \ "rootUrl").write[String] and
      (JsPath \ "dwsRootUrl").write[String]
    )(unlift(SerializableConfig.unapply))
}
