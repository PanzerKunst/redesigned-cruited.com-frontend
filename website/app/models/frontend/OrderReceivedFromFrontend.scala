package models.frontend

import play.api.libs.functional.syntax._
import play.api.libs.json.{JsPath, Reads}

case class OrderReceivedFromFrontend(emailAddress: String,
                                       linkedInAccountId: String)

object OrderReceivedFromFrontend {
  implicit val reads: Reads[OrderReceivedFromFrontend] = (
    (JsPath \ "emailAddress").read[String] and
      (JsPath \ "linkedInAccountId").read[String]
    )(OrderReceivedFromFrontend.apply _)
}
