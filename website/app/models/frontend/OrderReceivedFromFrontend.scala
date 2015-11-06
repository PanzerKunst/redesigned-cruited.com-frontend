package models.frontend

case class OrderReceivedFromFrontend(tempId: Long,
                                     editionId: Long,
                                     containedProductIds: List[Long],
                                     couponCode: Option[String],
                                     cvFileName: Option[String],
                                     coverLetterFileName: Option[String],
                                     accountId: Option[Long])
