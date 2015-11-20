package controllers

import play.api.http.HeaderNames._
import play.api.mvc.{EssentialAction, RequestHeader, Results}
import services.GlobalConfig

import scala.concurrent.ExecutionContext.Implicits.global

case class CorsAction()(action: EssentialAction) extends EssentialAction with Results {
  def apply(request: RequestHeader) = {
    action(request).map(result => result.withHeaders(
      ACCESS_CONTROL_ALLOW_ORIGIN -> GlobalConfig.allowedAccessControlOrigin,
      ACCESS_CONTROL_ALLOW_CREDENTIALS -> "true"
    ))
  }
}
