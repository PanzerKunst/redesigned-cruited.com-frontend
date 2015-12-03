package models

import play.api.libs.functional.syntax._
import play.api.libs.json.{JsPath, Writes}

case class DocumentReportScores(globalScore: Int,
                                categoryScores: Map[String, Int]) // [Category ID, Score] - No Json serializer found for type Map[Long,Int]

object DocumentReportScores {
  implicit val writes: Writes[DocumentReportScores] = (
    (JsPath \ "globalScore").write[Int] and
      (JsPath \ "categoryScores").write[Map[String, Int]]
    )(unlift(DocumentReportScores.unapply))
}
