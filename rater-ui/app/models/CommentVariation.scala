package models

import play.api.libs.functional.syntax._
import play.api.libs.json.{Format, JsPath}

case class CommentVariation(id: Long,
                            defaultCommentId: Long,
                            text: String,
                            editionId: Option[Long])

object CommentVariation {
  implicit val format: Format[CommentVariation] = (
    (JsPath \ "id").format[Long] and
      (JsPath \ "defaultCommentId").format[Long] and
      (JsPath \ "text").format[String] and
      (JsPath \ "editionId").formatNullable[Long]
    )(CommentVariation.apply, unlift(CommentVariation.unapply))

  val dbTagTypeEdition = "edition"
  val dbTagTypeLanguage = "language"
}
