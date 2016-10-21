package models.frontend

import play.api.libs.functional.syntax._
import play.api.libs.json.{JsPath, Reads}

case class OrderSearchData(fromTimestamp: Option[Long],
                           toTimestamp: Long,
                           excludedOrderIds: List[Long])

object OrderSearchData {
  implicit val reads: Reads[OrderSearchData] = (
    (JsPath \ "fromTimestamp").readNullable[Long] and
      (JsPath \ "toTimestamp").read[Long] and
      (JsPath \ "excludedOrderIds").read[List[Long]]
    )(OrderSearchData.apply _)
}
