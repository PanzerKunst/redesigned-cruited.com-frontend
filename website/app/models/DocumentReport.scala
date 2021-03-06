package models

import play.api.libs.functional.syntax._
import play.api.libs.json.{JsPath, Writes}

case class DocumentReport(redComments: List[RedComment],
                          topComments: List[TopComment],
                          overallComment: Option[String])

object DocumentReport {
  implicit val writes: Writes[DocumentReport] = (
    (JsPath \ "redComments").write[List[RedComment]] and
      (JsPath \ "topComments").write[List[TopComment]] and
      (JsPath \ "overallComment").writeNullable[String]
    )(unlift(DocumentReport.unapply))
}
