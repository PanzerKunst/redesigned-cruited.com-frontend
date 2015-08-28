package controllers.api

import play.api.Logger
import play.api.mvc.{Action, Controller}

class CouponApi extends Controller {
  val allowCORS = Array(ACCESS_CONTROL_ALLOW_ORIGIN -> "*")

  def create = Action { implicit request =>
    Logger.info("create")

    Ok.withHeaders(allowCORS: _*)
  }
}
