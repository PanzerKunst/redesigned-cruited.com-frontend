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
      case None => NoContent
      case Some(coupon) =>
        val accountIdOpt = SessionService.getAccountId(request.session)
        val orderIdOpt = SessionService.getOrderId(request.session)

        if (CouponService.hasExpired(coupon) || CouponService.hasReachedMaxUses(coupon, accountIdOpt, orderIdOpt)) {
          Logger.info("Someone tried to use the following expired (or used) coupon: '" + code + "'")
          Status(HttpService.httpStatusCouponExpired).apply(Json.toJson(coupon))
        } else {
          Ok(Json.toJson(coupon))
        }
    }
  }
}
