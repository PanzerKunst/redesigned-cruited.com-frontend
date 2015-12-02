package models

import db.CruitedProductDto
import models.frontend.FrontendOrder

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
                 customerComment: Option[String],
                 accountId: Option[Long],
                 status: Int,
                 creationTimestamp: Long) {

  def this(frontendOrder: FrontendOrder) = this(
    id = Some(frontendOrder.id),
    editionId = frontendOrder.edition.id,
    containedProductCodes = frontendOrder.containedProductCodes,
    couponId = frontendOrder.couponId,
    cvFileName = frontendOrder.cvFileName,
    coverLetterFileName = frontendOrder.coverLetterFileName,
    linkedinProfileFileName = frontendOrder.linkedinProfileFileName,
    positionSought = frontendOrder.positionSought,
    employerSought = frontendOrder.employerSought,
    jobAdUrl = frontendOrder.jobAdUrl,
    customerComment = frontendOrder.customerComment,
    accountId = frontendOrder.accountId,
    status = frontendOrder.status,
    creationTimestamp = frontendOrder.creationTimestamp
  )

  def getCvFileNameWithoutPrefix: Option[String] = {
    getFileNameWithoutPrefix(cvFileName)
  }

  private def getFileNameWithoutPrefix(fileName: Option[String]): Option[String] = {
    fileName match {
      case None => None
      case Some(fileNameWithPrefix) =>
        val indexFileNameAfterPrefix = fileNameWithPrefix.indexOf(Order.fileNamePrefixSeparator, 1) + Order.fileNamePrefixSeparator.length
        Some(fileNameWithPrefix.substring(indexFileNameAfterPrefix))
    }
  }

  def getCoverLetterFileNameWithoutPrefix: Option[String] = {
    getFileNameWithoutPrefix(coverLetterFileName)
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

  def getContainedProductCodesFromTypes(docTypes: String): List[String] = {
    docTypes.split(typeStringSeparator)
      .map { typeForDb => CruitedProduct.getCodeFromType(typeForDb)}
      .toList
  }
}
