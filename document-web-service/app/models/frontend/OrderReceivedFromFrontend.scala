package models.frontend

case class OrderReceivedFromFrontend(editionId: Long,
                                     containedDocTypes: List[String],
                                     couponCode: Option[String],
                                     cvFileName: Option[String],
                                     coverLetterFileName: Option[String],
                                     positionSought: Option[String],
                                     employerSought: Option[String],
                                     accountId: Option[Long],
                                     status: Int,
                                     sessionId: String)
