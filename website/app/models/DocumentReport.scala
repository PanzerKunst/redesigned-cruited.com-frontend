package models

import play.api.libs.functional.syntax._
import play.api.libs.json.{JsPath, Writes}

case class DocumentReport(score: Int,
                          redComments: List[RedComment],
                          topComments: List[TopComment])

object DocumentReport {
  implicit val writes: Writes[DocumentReport] = (
      (JsPath \ "score").write[Int] and
      (JsPath \ "redComments").write[List[RedComment]] and
      (JsPath \ "topComments").write[List[TopComment]]
    )(unlift(DocumentReport.unapply))
}
