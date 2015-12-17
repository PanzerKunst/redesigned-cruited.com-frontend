package services

import db.CouponDto
import models.Coupon

object CouponService {
  def hasReachedMaxUses(coupon: Coupon, accountIdOpt: Option[Long]): Boolean = {
    coupon.`type` match {
      case Coupon.typeNoRestriction => false
      case Coupon.typeSingleUse => CouponDto.useCount(coupon.code, None) >= 1
      case Coupon.typeTwoUses => CouponDto.useCount(coupon.code, None) >= 2
      case Coupon.typeOncePerAccount => CouponDto.useCount(coupon.code, Some(accountIdOpt.get)) >= 1
      case _ => CouponDto.useCount(coupon.code, Some(accountIdOpt.get)) >= coupon.maxUseCount
    }
  }
}
