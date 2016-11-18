package models

import play.api.libs.functional.syntax._
import play.api.libs.json.{Format, JsPath}

case class AssessmentReportScores(cvReportScores: Option[DocumentReportScores],
                                  coverLetterReportScores: Option[DocumentReportScores],
                                  linkedinProfileReportScores: Option[DocumentReportScores])

object AssessmentReportScores {
  implicit val format: Format[AssessmentReportScores] = (
    (JsPath \ "cvReportScores").formatNullable[DocumentReportScores] and
      (JsPath \ "coverLetterReportScores").formatNullable[DocumentReportScores] and
      (JsPath \ "linkedinProfileReportScores").formatNullable[DocumentReportScores]
    )(AssessmentReportScores.apply, unlift(AssessmentReportScores.unapply))
}
