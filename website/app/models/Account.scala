package models

import play.api.libs.functional.syntax._
import play.api.libs.json._

case class Account(id: Long,
                   firstName: Option[String],
                   lastName: Option[String],
                   emailAddress: Option[String],
                   password: Option[String],
                   linkedinProfile: JsValue,
                   `type`: Int,
                   creationTimestamp: Long) {

  def isAllowedToViewAllReportsAndEditOrders: Boolean = {
    `type` != Account.typeCustomer
  }
}

object Account {
  implicit val writes: Writes[Account] = (
    (JsPath \ "id").write[Long] and
      (JsPath \ "firstName").writeNullable[String] and
      (JsPath \ "lastName").writeNullable[String] and
      (JsPath \ "emailAddress").writeNullable[String] and
      (JsPath \ "password").writeNullable[String] and
      (JsPath \ "linkedinProfile").write[JsValue] and
      (JsPath \ "type").write[Int] and
      (JsPath \ "creationTimestamp").write[Long]
    )(unlift(Account.unapply))

  val typeCustomer = 2
  val typeRater = 3
  val typeAdmin = 1

  def getValidLinkedinProfileJson(linkedinProfileAsJsValue: JsValue): JsValue = {
    var linkedinProfile = linkedinProfileAsJsValue.as[JsObject]

    val validSummary = safetizeJsonStringValue(linkedinProfile \ "summary")
    linkedinProfile = linkedinProfile - "summary"
    if (validSummary != JsNull) {
      linkedinProfile = linkedinProfile + ("summary" -> validSummary)
    }

    val positions = (linkedinProfile \ "positions").as[JsObject]
    var writablePositions = positions.copy()

    val positionValuesOpt = (positions \ "values").asOpt[JsArray]
    var validPositionValues = new JsArray()

    if (positionValuesOpt.isDefined) {
      for (positionValue: JsValue <- positionValuesOpt.get.value.toArray) {
        var writablePositionValue = positionValue.as[JsObject].copy()
        val validSummary = safetizeJsonStringValue(positionValue \ "summary")
        writablePositionValue = writablePositionValue - "summary"
        if (validSummary != JsNull) {
          writablePositionValue = writablePositionValue + ("summary" -> validSummary)
        }

        validPositionValues = validPositionValues :+ writablePositionValue
      }
    }

    writablePositions = writablePositions - "values"
    writablePositions = writablePositions + ("values" -> validPositionValues)

    linkedinProfile = linkedinProfile - "positions"
    linkedinProfile = linkedinProfile + ("positions" -> writablePositions)

    linkedinProfile
  }

  private def safetizeJsonStringValue(jsLookupResult: JsLookupResult): JsValue = {
    jsLookupResult.asOpt[String] match {
      case None => JsNull
      case Some(stringValue) => JsString(stringValue.replaceAll("\\n", "\\\\n").replaceAll("\"", "\\\\\""))
    }
  }
}
