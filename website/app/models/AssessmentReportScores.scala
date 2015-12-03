package models

import play.api.libs.functional.syntax._
import play.api.libs.json.{JsPath, Writes}

case class AssessmentReportScores(cvReportScores: Option[DocumentReportScores],
                                  coverLetterReportScores: Option[DocumentReportScores],
                                  linkedinProfileReportScores: Option[DocumentReportScores])

object AssessmentReportScores {
  implicit val writes: Writes[AssessmentReportScores] = (
    (JsPath \ "cvReportScores").writeNullable[DocumentReportScores] and
      (JsPath \ "coverLetterReportScores").writeNullable[DocumentReportScores] and
      (JsPath \ "linkedinProfileReportScores").writeNullable[DocumentReportScores]
    )(unlift(AssessmentReportScores.unapply))
}
