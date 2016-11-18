package models

import play.api.libs.functional.syntax._
import play.api.libs.json.{Format, JsPath}

case class SupportedLanguage(id: Long,
                             ietfCode: String,
                             name: String)

object SupportedLanguage {
  implicit val format: Format[SupportedLanguage] = (
    (JsPath \ "id").format[Long] and
      (JsPath \ "ietfCode").format[String] and
      (JsPath \ "name").format[String]
    )(SupportedLanguage.apply, unlift(SupportedLanguage.unapply))
}
