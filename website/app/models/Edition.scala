package models

import play.api.libs.functional.syntax._
import play.api.libs.json.{JsPath, Writes}

case class Edition(id: Long,
                   code: String)

object Edition {
  implicit val writes: Writes[Edition] = (
    (JsPath \ "id").write[Long] and
      (JsPath \ "code").write[String]
    )(unlift(Edition.unapply))
}
