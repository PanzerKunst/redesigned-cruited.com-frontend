package models.frontend

import play.api.libs.functional.syntax._
import play.api.libs.json.{JsPath, Reads}

case class OrderSearchData(from: Option[Long],
                           to: Long,
                           excludedOrderIds: List[Long])

object OrderSearchData {
  implicit val reads: Reads[OrderSearchData] = (
    (JsPath \ "from").readNullable[Long] and
      (JsPath \ "to").read[Long] and
      (JsPath \ "excludedOrderIds").read[List[Long]]
    )(OrderSearchData.apply _)
}