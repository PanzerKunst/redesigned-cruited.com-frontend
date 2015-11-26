package models

import db.{CouponDto, CruitedProductDto}
import models.frontend.OrderReceivedFromFrontend

case class Order(id: Option[Long],
                 editionId: Long,
                 containedProductCodes: List[String],
                 couponId: Option[Long],
                 cvFileName: Option[String],
                 coverLetterFileName: Option[String],
                 linkedinProfileFileName: Option[String],
                 positionSought: Option[String],
                 employerSought: Option[String],
                 jobAdUrl: Option[String],
                 accountId: Option[Long],
                 status: Int,
                 creationTimestamp: Option[Long]) {

  def this(orderReceivedFromFrontend: OrderReceivedFromFrontend, id: Long) = this(
    id = Some(id),
    editionId = orderReceivedFromFrontend.editionId,
    containedProductCodes = Order.getContainedProductCodesFromTypesArray(orderReceivedFromFrontend.containedDocTypes),
    couponId = orderReceivedFromFrontend.couponCode match {
      case None => None
      case Some(couponCode) => CouponDto.getOfCode(couponCode) match {
        case None => None
        case Some(coupon) => Some(coupon.id)
      }
    },
    cvFileName = orderReceivedFromFrontend.cvFileName,
    coverLetterFileName = orderReceivedFromFrontend.coverLetterFileName,
    linkedinProfileFileName = None,
    positionSought = orderReceivedFromFrontend.positionSought,
    employerSought = orderReceivedFromFrontend.employerSought,
    jobAdUrl = None,
    accountId = orderReceivedFromFrontend.accountId,
    status = orderReceivedFromFrontend.status,
    creationTimestamp = None
  )

  def getCvFileNameWithoutPrefix: Option[String] = {
    getFileNameWithoutPrefix(cvFileName)
  }

  def getCoverLetterFileNameWithoutPrefix: Option[String] = {
    getFileNameWithoutPrefix(coverLetterFileName)
  }

  private def getFileNameWithoutPrefix(fileName: Option[String]): Option[String] = {
    fileName match {
      case None => None
      case Some(fileNameWithPrefix) =>
        val indexFileNameAfterPrefix = fileNameWithPrefix.indexOf(Order.fileNamePrefixSeparator, 1) + Order.fileNamePrefixSeparator.length
        Some(fileNameWithPrefix.substring(indexFileNameAfterPrefix))
    }
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

            for (i <- 1 to nbAboveOne - 1) {
              val product = allProducts.filter(p => p.code == containedProductCodes(i)).head
              result = result + typeStringSeparator + product.getTypeForDb
            }

            result
        }
    }
  }

  def getTypeForDbLegacy(docTypes: List[String]): String = {
    docTypes.length match {
      case 0 => ""
      case nbAboveZero => docTypes.mkString(typeStringSeparator)
    }
  }

  def getContainedProductCodesFromTypesString(docTypes: String): List[String] = {
    getContainedProductCodesFromTypesArray(docTypes.split(typeStringSeparator).toList)
  }

  def getContainedProductCodesFromTypesArray(docTypes: List[String]): List[String] = {
    docTypes.map { typeForDb => CruitedProduct.getCodeFromType(typeForDb)}
      .toList
  }
}
