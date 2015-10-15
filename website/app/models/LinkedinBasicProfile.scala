package models

import play.api.libs.functional.syntax._
import play.api.libs.json.{Format, JsPath, OFormat}

case class LinkedinBasicProfile(id: String,
                                firstName: String,
                                lastName: String,
                                maidenName: Option[String],
                                formattedName: String,
                                phoneticFirstName: String,
                                phoneticLastName: String,
                                formattedPhoneticName: String,
                                headline: String,
                                location: String,
                                industry: String,
                                currentShare: String,
                                numConnections: Int,
                                numConnectionsCapped: Boolean,
                                summary: String,
                                specialties: String,
                                positions: String,
                                pictureUrl: String,
                                originalPictureUrl: String,
                                siteStandardProfileRequest: String,
                                apiStandardProfileRequest: String,
                                publicProfileUrl: String,
                                emailAddress: String)

object LinkedinBasicProfile {
  // Fields are separated due to http://stackoverflow.com/questions/28167971/scala-case-having-22-fields-but-having-issue-with-play-json-in-scala-2-11-5
  val fields1to10: OFormat[(String, String, String, Option[String], String, String, String, String, String, String)] = (
    (JsPath \ "id").format[String] and
      (JsPath \ "firstName").format[String] and
      (JsPath \ "lastName").format[String] and
      (JsPath \ "maidenName").formatNullable[String] and
      (JsPath \ "formattedName").format[String] and
      (JsPath \ "phonetic-first-name").format[String] and
      (JsPath \ "phonetic-last-name").format[String] and
      (JsPath \ "formatted-phonetic-name").format[String] and
      (JsPath \ "headline").format[String] and
      (JsPath \ "location").format[String]
    ).tupled

  val fields11to20: OFormat[(String, String, Int, Int, String, String, String, String, String, String)] = (
    (JsPath \ "industry").format[String] and
      (JsPath \ "current-share").format[String] and
      (JsPath \ "num-connections").format[Int] and
      (JsPath \ "num-connections-capped").format[Int] and
      (JsPath \ "summary").format[String] and
      (JsPath \ "specialties").format[String] and
      (JsPath \ "positions").format[String] and
      (JsPath \ "picture-url").format[String] and
      (JsPath \ "original-picture-url").format[String] and
      (JsPath \ "site-standard-profile-request").format[String]
    ).tupled

  val fields21to30: OFormat[(String, String, String)] = (
    (JsPath \ "api-standard-profile-request").format[String] and
      (JsPath \ "public-profile-url").format[String] and
      (JsPath \ "email-address").format[String]
    ).tupled

  implicit val format: Format[LinkedinBasicProfile] = (
    fields1to10 and
      fields11to20 and
      fields21to30
    ).apply({
    case ((id, firstName, lastName, maidenName, formattedName, phoneticFirstName, phoneticLastName, formattedPhoneticName, headline, location),
    (industry, currentShare, numConnections, numConnectionsCapped, summary, specialties, positions, pictureUrl, originalPictureUrl, siteStandardProfileRequest),
    (apiStandardProfileRequest, publicProfileUrl, emailAddress)) =>
      LinkedinBasicProfile(id, firstName, lastName, maidenName, formattedName, phoneticFirstName, phoneticLastName, formattedPhoneticName, headline, location,
        industry, currentShare, numConnections, numConnectionsCapped, summary, specialties, positions, pictureUrl, originalPictureUrl, siteStandardProfileRequest,
        apiStandardProfileRequest, publicProfileUrl, emailAddress)
  }, huge => ((huge.id, huge.firstName, huge.lastName, huge.maidenName, huge.formattedName, huge.phoneticFirstName, huge.phoneticLastName, huge.formattedPhoneticName, huge.headline, huge.location),
    (huge.industry, huge.currentShare, huge.numConnections, huge.numConnectionsCapped, huge.summary, huge.specialties, huge.positions, huge.pictureUrl, huge.originalPictureUrl, huge.siteStandardProfileRequest),
    (huge.apiStandardProfileRequest, huge.publicProfileUrl, huge.emailAddress)))
}
