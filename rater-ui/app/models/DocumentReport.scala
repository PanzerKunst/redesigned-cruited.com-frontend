package models

import play.api.libs.functional.syntax._
import play.api.libs.json.{Format, JsPath}

case class DocumentReport(redComments: List[RedComment],
                          wellDoneComments: List[WellDoneComment],
                          overallComment: Option[String])

object DocumentReport {
  implicit val format: Format[DocumentReport] = (
    (JsPath \ "redComments").format[List[RedComment]] and
      (JsPath \ "wellDoneComments").format[List[WellDoneComment]] and
      (JsPath \ "overallComment").formatNullable[String]
    )(DocumentReport.apply, unlift(DocumentReport.unapply))
}
