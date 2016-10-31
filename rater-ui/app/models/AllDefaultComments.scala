package models

import play.api.libs.functional.syntax._
import play.api.libs.json.{Format, JsPath}

case class AllDefaultComments(cv: List[DefaultComment],
                              coverLetter: List[DefaultComment],
                              linkedinProfile: List[DefaultComment])

object AllDefaultComments {
  implicit val format: Format[AllDefaultComments] = (
    (JsPath \ "cv").format[List[DefaultComment]] and
      (JsPath \ "coverLetter").format[List[DefaultComment]] and
      (JsPath \ "linkedinProfile").format[List[DefaultComment]]
    )(AllDefaultComments.apply, unlift(AllDefaultComments.unapply))
}
