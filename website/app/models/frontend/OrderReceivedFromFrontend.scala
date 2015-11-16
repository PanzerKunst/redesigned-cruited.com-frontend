package models.frontend

case class OrderReceivedFromFrontend(tempId: Long,
                                     editionId: Long,
                                     containedProductCodes: List[String],
                                     couponCode: Option[String],
                                     cvFileName: Option[String],
                                     coverLetterFileName: Option[String],
                                     accountId: Option[Long])
