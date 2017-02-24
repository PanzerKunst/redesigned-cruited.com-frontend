package models.frontend

case class OrderReceivedFromFrontend(tempId: Long,
                                     editionId: Option[Long] = None,
                                     containedProductCodes: List[String],
                                     couponCode: Option[String],
                                     cvFileName: Option[String],
                                     coverLetterFileName: Option[String] = None,
                                     positionSought: Option[String] = None,
                                     employerSought: Option[String] = None,
                                     jobAdUrl: Option[String],
                                     jobAdFileName: Option[String],
                                     customerComment: Option[String] = None,
                                     accountId: Option[Long])
