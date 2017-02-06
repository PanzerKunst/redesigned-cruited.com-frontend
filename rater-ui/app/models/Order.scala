package models

import models.frontend.FrontendOrder

case class Order(id: Long,
                 editionCode: String,
                 containedProductCodes: List[String],
                 couponId: Option[Long],
                 cvFileName: Option[String],
                 coverLetterFileName: Option[String],
                 linkedinProfileFileName: Option[String],
                 positionSought: Option[String],
                 employerSought: Option[String],
                 jobAdUrl: Option[String],
                 jobAdFileName: Option[String],
                 customerComment: Option[String],
                 customer: Account,
                 rater: Option[Account],
                 status: Int,
                 languageCode: String,
                 creationTimestamp: Long,
                 paymentTimestamp: Long) {

  def this(frontendOrder: FrontendOrder) = this(
    id = frontendOrder.id,
    editionCode = frontendOrder.editionCode,
    containedProductCodes = frontendOrder.containedProductCodes,
    couponId = frontendOrder.coupon match {
      case None => None
      case Some(coupon) => Some(coupon.id)
    },
    cvFileName = frontendOrder.cvFileName,
    coverLetterFileName = frontendOrder.coverLetterFileName,
    linkedinProfileFileName = frontendOrder.linkedinProfileFileName,
    positionSought = frontendOrder.positionSought,
    employerSought = frontendOrder.employerSought,
    jobAdUrl = frontendOrder.jobAdUrl,
    jobAdFileName = frontendOrder.jobAdFileName,
    customerComment = frontendOrder.customerComment,
    customer = frontendOrder.customer,
    rater = frontendOrder.rater,
    status = frontendOrder.status,
    languageCode = frontendOrder.languageCode,
    creationTimestamp = frontendOrder.creationTimestamp,
    paymentTimestamp = frontendOrder.paymentTimestamp
  )
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

  val showIdActive = 1
  val showIdDeleted = 2

  def getContainedProductCodesFromTypesString(docTypes: String): List[String] = {
    val typeArray = docTypes.split(typeStringSeparator).map { docType => docType.trim}
    getContainedProductCodesFromTypesArray(typeArray)
  }

  def getContainedProductCodesFromTypesArray(docTypes: Array[String]): List[String] = {
    docTypes.map { typeForDb => CruitedProduct.codeFromType(typeForDb)}
      .toList.sortWith(sortProductCodes)
  }

  def getFileNameWithoutPrefix(fileName: Option[String]): Option[String] = {
    fileName match {
      case None => None
      case Some(fileNameWithPrefix) =>
        val indexFileNameAfterPrefix = fileNameWithPrefix.indexOf(Order.fileNamePrefixSeparator, 1) + Order.fileNamePrefixSeparator.length
        Some(fileNameWithPrefix.substring(indexFileNameAfterPrefix))
    }
  }

  private def sortProductCodes(pc1: String, pc2: String): Boolean = {
    if (pc2 == CruitedProduct.codeLinkedinProfileReview) {
      true
    } else if (pc2 == CruitedProduct.codeCoverLetterReview && pc1 == CruitedProduct.codeCvReview) {
      true
    } else {
      false
    }
  }
}
