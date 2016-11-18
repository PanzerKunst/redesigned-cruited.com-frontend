package models

import play.api.libs.functional.syntax._
import play.api.libs.json.{Format, JsPath}

case class AssessmentReport(orderId: Long,
                            cvReport: Option[DocumentReport],
                            coverLetterReport: Option[DocumentReport],
                            linkedinProfileReport: Option[DocumentReport])

object AssessmentReport {
  implicit val format: Format[AssessmentReport] = (
    (JsPath \ "orderId").format[Long] and
      (JsPath \ "cvReport").formatNullable[DocumentReport] and
      (JsPath \ "coverLetterReport").formatNullable[DocumentReport] and
      (JsPath \ "linkedinProfileReport").formatNullable[DocumentReport]
    )(AssessmentReport.apply, unlift(AssessmentReport.unapply))
}
