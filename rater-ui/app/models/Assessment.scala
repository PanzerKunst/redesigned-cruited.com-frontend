package models

import play.api.libs.functional.syntax._
import play.api.libs.json.{Format, JsPath}

case class Assessment(orderId: Long,

                      cvCommentList: List[AssessmentComment],
                      coverLetterCommentList: List[AssessmentComment],
                      linkedinProfileCommentList: List[AssessmentComment],

                      cvReport: Option[DocumentReport],
                      coverLetterReport: Option[DocumentReport],
                      linkedinProfileReport: Option[DocumentReport])

object Assessment {
  implicit val format: Format[Assessment] = (
    (JsPath \ "orderId").format[Long] and
      (JsPath \ "cvCommentList").format[List[AssessmentComment]] and
      (JsPath \ "coverLetterCommentList").format[List[AssessmentComment]] and
      (JsPath \ "linkedinProfileCommentList").format[List[AssessmentComment]] and
      (JsPath \ "cvReport").formatNullable[DocumentReport] and
      (JsPath \ "coverLetterReport").formatNullable[DocumentReport] and
      (JsPath \ "linkedinProfileReport").formatNullable[DocumentReport]
    )(Assessment.apply, unlift(Assessment.unapply))
}
