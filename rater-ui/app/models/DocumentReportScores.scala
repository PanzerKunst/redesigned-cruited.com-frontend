package models

import play.api.libs.functional.syntax._
import play.api.libs.json.{Format, JsPath}

case class DocumentReportScores(globalScore: Int,
                                categoryScores: Map[String, Int]) // [Category ID, Score] - No Json serializer found for type Map[Long,Int]

object DocumentReportScores {
  implicit val format: Format[DocumentReportScores] = (
    (JsPath \ "globalScore").format[Int] and
      (JsPath \ "categoryScores").format[Map[String, Int]]
    )(DocumentReportScores.apply, unlift(DocumentReportScores.unapply))
}
