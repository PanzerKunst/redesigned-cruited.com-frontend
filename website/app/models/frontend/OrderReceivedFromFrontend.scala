package models.frontend

case class OrderReceivedFromFrontend(tempId: Long,
                                     editionId: Long,
                                     containedProductCodes: List[String],
                                     couponCode: Option[String],
                                     cvFileName: Option[String],
                                     coverLetterFileName: Option[String],
                                     positionSought: Option[String],
                                     employerSought: Option[String],
                                     jobAdUrl: Option[String],
                                     accountId: Option[Long])
