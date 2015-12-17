package controllers.api

import javax.inject.Singleton

import db.CouponDto
import play.api.libs.json.Json
import play.api.mvc.{Action, Controller}
import services.{CouponService, HttpService, SessionService}

@Singleton
class CouponApi extends Controller {
  def get(code: String) = Action { request =>
    CouponDto.getOfCode(code) match {
      case None => NoContent
      case Some(coupon) =>
        if (CouponService.hasReachedMaxUses(coupon, SessionService.getAccountId(request.session))) {
          Status(HttpService.httpStatusCouponHasReachedMaxUses)
        } else {
          Ok(Json.toJson(coupon))
        }
    }
  }
}
