package services

import play.api.libs.json.{JsNull, JsValue, Json}
import play.api.mvc.{AnyContent, Request, Session}

object HttpService {
  val httpStatusEmailAlreadyRegistered = 230
  val httpStatusLinkedinAccountIdAlreadyRegistered = 231
}
