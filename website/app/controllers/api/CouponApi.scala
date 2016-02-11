package controllers.api

import javax.inject.Singleton

import db.CouponDto
import play.api.Logger
import play.api.libs.json.Json
import play.api.mvc.{Action, Controller}
import services.{CouponService, HttpService, SessionService}

@Singleton
class CouponApi extends Controller {
  def get(code: String) = Action { request =>
    CouponDto.getOfCode(code) match {
      case None =>
        Logger.info("Someone tried to use the following incorrect or expired coupon: '" + code + "'")
        NoContent
      case Some(coupon) =>
        if (CouponService.hasReachedMaxUses(coupon, SessionService.getAccountId(request.session))) {
          Status(HttpService.httpStatusCouponHasReachedMaxUses)
        } else {
          Ok(Json.toJson(coupon))
        }
    }
  }
}
