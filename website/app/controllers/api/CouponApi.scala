package controllers.api

import javax.inject.Singleton

import db.CouponDto
import play.api.libs.json.Json
import play.api.mvc.{Action, Controller}

@Singleton
class CouponApi extends Controller {
  def get(code: String) = Action { request =>
    Ok(Json.toJson(CouponDto.getOfCode(code)))
  }
}
