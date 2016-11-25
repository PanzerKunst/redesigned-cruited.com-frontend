package models

import play.api.libs.functional.syntax._
import play.api.libs.json.{Format, JsPath}

case class AssessmentComment(defaultComment: DefaultComment,
                             isGreenSelected: Boolean,
                             redText: Option[String])

object AssessmentComment {
  implicit val format: Format[AssessmentComment] = (
    (JsPath \ "defaultComment").format[DefaultComment] and
      (JsPath \ "isGreenSelected").format[Boolean] and
      (JsPath \ "redText").formatNullable[String]
    )(AssessmentComment.apply, unlift(AssessmentComment.unapply))
}
