package services

import java.util.Date

import db.CouponDto
import models.Coupon

object CouponService {
  def hasExpired(coupon: Coupon): Boolean = {
    coupon.expirationTimestamp < new Date().getTime
  }

  def hasReachedMaxUses(coupon: Coupon, accountIdOpt: Option[Long]): Boolean = {
    coupon.`type` match {
      case Coupon.typeNoRestriction => false
      case Coupon.typeSingleUse => CouponDto.useCount(coupon.code, None) >= 1
      case Coupon.typeTwoUses => CouponDto.useCount(coupon.code, None) >= 2
      case Coupon.typeOncePerAccount => accountIdOpt match {
        case None => false
        case Some(accountId) => CouponDto.useCount(coupon.code, Some(accountId)) >= 1
      }
      case _ => accountIdOpt match {
        case None => false
        case Some(accountId) => CouponDto.useCount(coupon.code, Some(accountId)) >= coupon.maxUseCount
      }
    }
  }
}
