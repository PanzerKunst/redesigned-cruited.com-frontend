package models

import db.{CouponDto, CruitedProductDto, EditionDto, ReductionDto}
import models.frontend.FrontendOrder
import play.api.Logger

case class Order(id: Option[Long],
                 editionId: Long,
                 containedProductCodes: List[String],
                 couponId: Option[Long],
                 cvFileName: Option[String],
                 coverLetterFileName: Option[String],
                 linkedinProfileFileName: Option[String],
                 linkedinProfileLanguage: Option[String],
                 positionSought: Option[String],
                 employerSought: Option[String],
                 jobAdUrl: Option[String],
                 jobAdFileName: Option[String],
                 customerComment: Option[String],
                 accountId: Option[Long],
                 status: Int,
                 languageCode: String,
                 creationTimestamp: Long,
                 paymentTimestamp: Option[Long]) {

  def this(frontendOrder: FrontendOrder, linkedinProfileFileName: Option[String]) = this(
    id = Some(frontendOrder.id),
    editionId = frontendOrder.edition.id,
    containedProductCodes = frontendOrder.containedProductCodes,
    couponId = frontendOrder.coupon match {
      case None => None
      case Some(coupon) => Some(coupon.id)
    },
    cvFileName = frontendOrder.cvFileName,
    coverLetterFileName = frontendOrder.coverLetterFileName,
    linkedinProfileFileName = linkedinProfileFileName,
    linkedinProfileLanguage = frontendOrder.linkedinProfileLanguage,
    positionSought = frontendOrder.positionSought,
    employerSought = frontendOrder.employerSought,
    jobAdUrl = frontendOrder.jobAdUrl,
    jobAdFileName = frontendOrder.jobAdFileName,
    customerComment = frontendOrder.customerComment,
    accountId = frontendOrder.accountId,
    status = frontendOrder.status,
    languageCode = frontendOrder.languageCode,
    creationTimestamp = frontendOrder.creationTimestamp,
    paymentTimestamp = frontendOrder.paymentTimestamp
  )

  def getCostAfterReductions: Int = {
    var orderedProducts: List[CruitedProduct] = List()
    for (p <- CruitedProductDto.getAll) {
      if (containedProductCodes.contains(p.code)) {
        orderedProducts = orderedProducts :+ p
      }
    }


    // Product cost
    val orderPriceAmounts = orderedProducts.map(p => p.price.amount)
    var costAfterReductions = orderPriceAmounts.sum

    Logger.info("costAfterReductions - 1:" + costAfterReductions)


    // Reductions
    val allReductions = ReductionDto.getAll

    val reduction = orderedProducts.length match {
      case 2 => Some(allReductions.find(r => r.code == Reduction.code2ProductsSameOrder).get)
      case 3 => Some(allReductions.find(r => r.code == Reduction.code3ProductsSameOrder).get)
      case other => None
    }

    if (reduction.isDefined) {
      costAfterReductions = costAfterReductions - reduction.get.price.amount
    }

    Logger.info("costAfterReductions - 2:" + costAfterReductions)


    // Coupon
    if (couponId.isDefined) {
      val coupon = CouponDto.getOfId(couponId.get).get
      coupon.discountPercentage match {
        case Some(discountPercentage) =>
          val couponReductionAmount = costAfterReductions * discountPercentage / 100
          costAfterReductions = costAfterReductions - couponReductionAmount

        case None =>
          if (coupon.discountPrice.isDefined) {
            costAfterReductions = costAfterReductions - coupon.discountPrice.get.amount
          }
      }
    }

    Logger.info("costAfterReductions - 3:" + math.round(costAfterReductions).toInt)

    math.round(costAfterReductions).toInt
  }

  def isForConsultant: Boolean = {
    if (EditionDto.getOfId(editionId).get.code == Edition.CodeConsultant) {
      return true
    }

    for (pc <- containedProductCodes) {
      if (pc != CruitedProduct.CodeCvReviewForConsultant && pc != CruitedProduct.CodeLinkedinProfileReviewForConsultant) {
        return false
      }
    }

    true
  }

  def isOfClassicProducts: Boolean = {
    for (pc <- containedProductCodes) {
      if (pc != CruitedProduct.CodeCvReview &&
        pc != CruitedProduct.CodeCoverLetterReview &&
        pc != CruitedProduct.CodeLinkedinProfileReview) {

        return false
      }
    }

    true
  }
}

object Order {
  val fileNamePrefixSeparator = "-"
  val typeStringSeparator = ","

  val statusIdNotPaid = -1
  val statusIdPaid = 0
  val statusIdInProgress = 1
  val statusIdAwaitingFeedback = 4
  val statusIdScheduled = 3
  val statusIdComplete = 2

  def getTypeForDb(containedProductCodes: List[String]): String = {
    containedProductCodes.length match {
      case 0 => ""
      case nbAboveZero =>
        val allProducts = CruitedProductDto.getAll
        nbAboveZero match {
          case 1 =>
            allProducts.filter(p => p.code == containedProductCodes.head).head
              .getTypeForDb
          case nbAboveOne =>
            // First item handled differently - no comma prefix
            val firstProduct = allProducts.filter(p => p.code == containedProductCodes.head).head

            var result = firstProduct.getTypeForDb

            for (i <- 1 until nbAboveOne) {
              val product = allProducts.filter(p => p.code == containedProductCodes(i)).head
              result = result + typeStringSeparator + product.getTypeForDb
            }

            result
        }
    }
  }

  def getContainedProductCodesFromTypesString(docTypes: String): List[String] = {
    val typeArray = docTypes.split(typeStringSeparator).map { docType => docType.trim }
    getContainedProductCodesFromTypesArray(typeArray)
  }

  def getContainedProductCodesFromTypesArray(docTypes: Array[String]): List[String] = {
    docTypes.map { typeForDb => CruitedProduct.getCodeFromType(typeForDb) }
      .toList
  }

  def getFileNameWithoutPrefix(fileName: Option[String]): Option[String] = {
    fileName match {
      case None => None
      case Some(fileNameWithPrefix) =>
        val indexFileNameAfterPrefix = fileNameWithPrefix.indexOf(Order.fileNamePrefixSeparator, 1) + Order.fileNamePrefixSeparator.length
        Some(fileNameWithPrefix.substring(indexFileNameAfterPrefix))
    }
  }
}
