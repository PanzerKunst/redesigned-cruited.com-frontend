package models.client

case class OrderReceivedFromClient(editionId: Long,
                                   containedDocTypes: List[String],
                                   couponCode: Option[String],
                                   cvFileName: Option[String],
                                   coverLetterFileName: Option[String],
                                   linkedinPublicProfileUrl: Option[String],
                                   positionSought: Option[String],
                                   employerSought: Option[String],
                                   accountId: Option[Long],
                                   status: Int,
                                   sessionId: String)
