package services

import play.api.Play
import play.api.Play.current

object GlobalConfig {
  val applicationSecret = Play.configuration.getString("play.crypto.secret").get
  val allowedAccessControlOrigin = Play.configuration.getString("allowedAccessControlOrigin").get
  val linkedinProfilePdfFileNameWithoutPrefix = Play.configuration.getString("linkedinProfile.pdfFileName.withoutPrefix").get
}
