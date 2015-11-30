package models

import models.frontend.FrontendOrder
import play.api.libs.json.{Writes, JsPath}
import play.api.libs.functional.syntax._

case class AssessmentReport(order: FrontendOrder,
                            cvReport: Option[DocumentReport],
                            coverLetterReport: Option[DocumentReport],
                            linkedinProfileReport: Option[DocumentReport])

object AssessmentReport {
  implicit val writes: Writes[AssessmentReport] = (
    (JsPath \ "order").write[FrontendOrder] and
      (JsPath \ "cvReport").writeNullable[DocumentReport] and
      (JsPath \ "coverLetterReport").writeNullable[DocumentReport] and
      (JsPath \ "linkedinProfileReport").writeNullable[DocumentReport]
    )(unlift(AssessmentReport.unapply))
}
