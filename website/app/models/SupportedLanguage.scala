package models

import play.api.libs.functional.syntax._
import play.api.libs.json.{JsPath, Writes}

case class SupportedLanguage(id: Long,
                             ietfCode: String,
                             name: String)

object SupportedLanguage {
  implicit val writes: Writes[SupportedLanguage] = (
    (JsPath \ "id").write[Long] and
      (JsPath \ "ietfCode").write[String] and
      (JsPath \ "name").write[String]
    )(unlift(SupportedLanguage.unapply))
}
