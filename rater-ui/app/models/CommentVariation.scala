package models

import play.api.libs.functional.syntax._
import play.api.libs.json.{Format, JsPath}

case class CommentVariation(id: Long,
                            defaultComment: DefaultComment,
                            text: String,
                            edition: Option[Edition],
                            languageCode: Option[String])

object CommentVariation {
  implicit val format: Format[CommentVariation] = (
    (JsPath \ "id").format[Long] and
      (JsPath \ "defaultComment").format[DefaultComment] and
      (JsPath \ "text").format[String] and
      (JsPath \ "edition").formatNullable[Edition] and
      (JsPath \ "languageCode").formatNullable[String]
    )(CommentVariation.apply, unlift(CommentVariation.unapply))

  val dbVariationTypeEdition = "edition"
  val dbVariationTypeLanguage = "language"
}
