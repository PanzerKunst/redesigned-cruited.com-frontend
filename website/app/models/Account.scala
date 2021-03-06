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
                   languageCode: String,
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
      (JsPath \ "languageCode").write[String] and
      (JsPath \ "creationTimestamp").write[Long]
    ) (unlift(Account.unapply))

  val typeCustomer = 2
  val typeRater = 3
  val typeAdmin = 1

  val showActive = 1
  val showDeleted = 2

  def getValidLinkedinProfileJson(linkedinProfileAsJsValue: JsValue): JsValue = {
    var linkedinProfile = linkedinProfileAsJsValue.as[JsObject]

    // Main summary
    val validSummary = safetizeJsonStringValue(linkedinProfile \ "summary")
    linkedinProfile = linkedinProfile - "summary"
    if (validSummary != JsNull) {
      linkedinProfile = linkedinProfile + ("summary" -> validSummary)
    }

    // Headline
    val validHeadline = safetizeJsonStringValue(linkedinProfile \ "headline")
    linkedinProfile = linkedinProfile - "headline"
    if (validHeadline != JsNull) {
      linkedinProfile = linkedinProfile + ("headline" -> validHeadline)
    }

    // Specialties
    val validSpecialties = safetizeJsonStringValue(linkedinProfile \ "specialties")
    linkedinProfile = linkedinProfile - "specialties"
    if (validSpecialties != JsNull) {
      linkedinProfile = linkedinProfile + ("specialties" -> validSpecialties)
    }

    val positions = (linkedinProfile \ "positions").as[JsObject]

    val positionValuesOpt = (positions \ "values").asOpt[JsArray]
    var validPositionValues = JsArray()

    if (positionValuesOpt.isDefined) {
      for (positionValue: JsValue <- positionValuesOpt.get.value.toArray) {
        // Title for each position
        val validTitle = safetizeJsonStringValue(positionValue \ "title")
        var writablePositionValue = positionValue.as[JsObject].copy() - "title"
        if (validTitle != JsNull) {
          writablePositionValue = writablePositionValue + ("title" -> validTitle)
        }

        // Summary for each position
        val validSummary = safetizeJsonStringValue(positionValue \ "summary")
        writablePositionValue = writablePositionValue - "summary"
        if (validSummary != JsNull) {
          writablePositionValue = writablePositionValue + ("summary" -> validSummary)
        }

        validPositionValues = validPositionValues :+ writablePositionValue
      }
    }

    var writablePositions = positions.copy() - "values"
    writablePositions = writablePositions + ("values" -> validPositionValues)

    linkedinProfile = linkedinProfile - "positions"
    linkedinProfile = linkedinProfile + ("positions" -> writablePositions)

    (linkedinProfile \ "currentShare").asOpt[JsObject] match {
      case None =>
      case Some(currentShare) =>
        // Current share > Comment
        val validComment = safetizeJsonStringValue(currentShare \ "comment")

        var writableCurrentShare = currentShare.copy() - "comment"
        writableCurrentShare = writableCurrentShare + ("comment" -> validComment)

        (currentShare \ "content").asOpt[JsObject] match {
          case None =>
          case Some(currentShareContent) =>
            // Current share > Content > Title
            val validContentTitle = safetizeJsonStringValue(currentShareContent \ "title")
            var writableCurrentShareContent = currentShareContent.copy() - "title"
            writableCurrentShareContent = writableCurrentShareContent + ("title" -> validContentTitle)

            // Current share > Content > Description
            val validContentDescription = safetizeJsonStringValue(currentShareContent \ "description")
            writableCurrentShareContent = writableCurrentShareContent - "description"
            writableCurrentShareContent = writableCurrentShareContent + ("description" -> validContentDescription)

            writableCurrentShare = writableCurrentShare - "content"
            writableCurrentShare = writableCurrentShare + ("content" -> writableCurrentShareContent)
        }

        // Current share > Attribution > Share > Comment
        (currentShare \ "attribution").asOpt[JsObject] match {
          case None =>
          case Some(currentShareAttribution) =>
            (currentShareAttribution \ "share").asOpt[JsObject] match {
              case None =>
              case Some(currentShareAttributionShare) =>
                val validShareComment = safetizeJsonStringValue(currentShareAttributionShare \ "comment")

                var writableCurrentShareAttributionShare = currentShareAttributionShare.copy() - "comment"
                writableCurrentShareAttributionShare = writableCurrentShareAttributionShare + ("comment" -> validShareComment)

                var writableCurrentShareAttribution = currentShareAttribution.copy() - "share"
                writableCurrentShareAttribution = writableCurrentShareAttribution + ("share" -> writableCurrentShareAttributionShare)

                writableCurrentShare = writableCurrentShare - "attribution"
                writableCurrentShare = writableCurrentShare + ("attribution" -> writableCurrentShareAttribution)
            }
        }

        linkedinProfile = linkedinProfile - "currentShare"
        linkedinProfile = linkedinProfile + ("currentShare" -> writableCurrentShare)
    }

    linkedinProfile
  }

  private def safetizeJsonStringValue(jsLookupResult: JsLookupResult): JsValue = {
    jsLookupResult.asOpt[String] match {
      case None => JsNull
      case Some(stringValue) => JsString(stringValue
        .replaceAll("\r\n", "\\\\n")
        .replaceAll("\\n", "\\\\n")
        .replaceAll("\"", "\\\\\"")
        .replaceAll("\\t", "    ")
        .replaceAll("\\\\s", "\\\\ ")
      )
    }
  }
}
