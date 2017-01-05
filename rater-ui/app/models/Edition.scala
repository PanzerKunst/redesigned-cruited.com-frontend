package models

import play.api.libs.functional.syntax._
import play.api.libs.json.{Format, JsPath}

case class Edition(id: Long,
                   code: String)

object Edition {
  implicit val format: Format[Edition] = (
    (JsPath \ "id").format[Long] and
      (JsPath \ "code").format[String]
    )(Edition.apply, unlift(Edition.unapply))
}
