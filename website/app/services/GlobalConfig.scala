package services

import play.api.Play
import play.api.Play.current

object GlobalConfig {
  val applicationSecret = Play.configuration.getString("play.crypto.secret").get
}
