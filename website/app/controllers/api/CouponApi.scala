package controllers.api

import javax.inject.Singleton

import db.CouponDto
import play.api.libs.json.Json
import play.api.mvc.{Action, Controller}

@Singleton
class CouponApi extends Controller {
  def get(code: String) = Action { request =>
    CouponDto.getOfCode(code) match {
      case None => NoContent
      case Some(coupon) => Ok(Json.toJson(CouponDto.getOfCode(code)))
    }
  }
}
