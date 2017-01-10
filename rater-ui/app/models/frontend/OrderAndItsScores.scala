package models.frontend

import models.{AssessmentReportScores, Account, Coupon}
import play.api.libs.functional.syntax._
import play.api.libs.json.{Format, JsPath}

case class OrderAndItsScores(order: FrontendOrder,
                             scores: AssessmentReportScores)

object OrderAndItsScores {
  implicit val format: Format[OrderAndItsScores] = (
    (JsPath \ "order").format[FrontendOrder] and
      (JsPath \ "scores").format[AssessmentReportScores]
    )(OrderAndItsScores.apply, unlift(OrderAndItsScores.unapply))
}
