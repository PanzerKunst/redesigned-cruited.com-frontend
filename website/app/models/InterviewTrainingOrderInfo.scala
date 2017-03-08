package models

import java.util.Date

import play.api.libs.functional.syntax._
import play.api.libs.json.{JsPath, Writes}

case class InterviewTrainingOrderInfo(id: Option[Long] = None,
                                      orderId: Long,
                                      interviewDate: Option[Date],
                                      importantForTheRole: Option[String],
                                      latestInterview: Option[String],
                                      needForImprovement: Option[String],
                                      challengingQuestions: Option[String])

object InterviewTrainingOrderInfo {
  implicit val writes: Writes[InterviewTrainingOrderInfo] = (
    (JsPath \ "id").writeNullable[Long] and
      (JsPath \ "orderId").write[Long] and
      (JsPath \ "interviewDate").writeNullable[Date] and
      (JsPath \ "importantForTheRole").writeNullable[String] and
      (JsPath \ "latestInterview").writeNullable[String] and
      (JsPath \ "needForImprovement").writeNullable[String] and
      (JsPath \ "challengingQuestions").writeNullable[String]
    )(unlift(InterviewTrainingOrderInfo.unapply))
}
