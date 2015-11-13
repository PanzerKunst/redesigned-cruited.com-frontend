package services

import javax.inject.{Inject, Singleton}

import db.{AccountDto, OrderDto}
import models.{CruitedProduct, Order}

@Singleton
class OrderService @Inject()(val documentService: DocumentService) {
  def finaliseFileNames(orderId: Long) {
    val orderToFinalise = OrderDto.getOfId(orderId).get

    val finalisedCvFileName = orderToFinalise.getCvFileNameWithoutPrefix match {
      case None => None
      case Some(fileNameWithoutPrefix) => Some(orderId + Order.fileNamePrefixSeparator + fileNameWithoutPrefix)
    }

    val finalisedCoverLetterFileName = orderToFinalise.getCoverLetterFileNameWithoutPrefix match {
      case None => None
      case Some(fileNameWithoutPrefix) => Some(orderId + Order.fileNamePrefixSeparator + fileNameWithoutPrefix)
    }

    val orderWithFinalisedFileNames = orderToFinalise.copy(
      cvFileName = finalisedCvFileName,
      coverLetterFileName = finalisedCoverLetterFileName
    )

    OrderDto.update(orderWithFinalisedFileNames)

    if (orderToFinalise.cvFileName.isDefined) {
      documentService.renameFile(orderToFinalise.cvFileName.get, orderWithFinalisedFileNames.cvFileName.get)
    }
    if (orderToFinalise.coverLetterFileName.isDefined) {
      documentService.renameFile(orderToFinalise.coverLetterFileName.get, orderWithFinalisedFileNames.coverLetterFileName.get)
    }
  }

  def convertDocsToPdf(orderId: Long) {
    documentService.convertDocsToPdf(orderId)
    convertLinkedinPublicProfilePageToPdf(orderId)
    updateFileNamesInDb(orderId)
  }

  def generateDocThumbnails(orderId: Long) {
    val order = OrderDto.getOfId(orderId).get

    generateThumbnailForFile(order.cvFileName)
    generateThumbnailForFile(order.coverLetterFileName)
    generateThumbnailForFile(order.linkedinProfileFileName)
  }

  private def generateThumbnailForFile(fileNameOpt: Option[String]) {
    fileNameOpt match {
      case None =>
      case Some(fileName) =>
        if (documentService.isFilePresent(fileName)) {
          documentService.generateThumbnail(fileName)
        }
    }
  }

  private def convertLinkedinPublicProfilePageToPdf(orderId: Long) {
    val accountId = OrderDto.getOfId(orderId).get.accountId.get
    AccountDto.getOfId(accountId).get.linkedinProfile match {
      case None =>
      case Some(linkedinProfile) => documentService.convertLinkedinProfilePageToPdf(orderId, (linkedinProfile \ "publicProfileUrl").as[String])
    }
  }

  private def updateFileNamesInDb(orderId: Long) {
    val order = OrderDto.getOfId(orderId).get

    val orderWithPdfFileNames = order.copy(
      cvFileName = getNewCvFileName(order),
      coverLetterFileName = getNewCoverLetterFileName(order),
      linkedinProfileFileName = getNewLinkedinProfileFileName(order)
    )

    OrderDto.update(orderWithPdfFileNames)
  }

  private def getNewCvFileName(order: Order): Option[String] = {
    if (order.cvFileName.isDefined && documentService.getFileExtension(order.cvFileName.get) != documentService.extensionPdf) {
      if (!documentService.isFilePresent(order.cvFileName.get)) {
        throw new Exception("OrderService.updateFileNamesInDb() > CV file name found in DB for order " + order.id.get + " but no corresponding file found")
      }
      Some(order.cvFileName.get + "." + documentService.extensionPdf)
    } else {
      None
    }
  }

  private def getNewCoverLetterFileName(order: Order): Option[String] = {
    if (order.coverLetterFileName.isDefined && documentService.getFileExtension(order.coverLetterFileName.get) != documentService.extensionPdf) {
      if (!documentService.isFilePresent(order.coverLetterFileName.get)) {
        throw new Exception("OrderService.updateFileNamesInDb() > Cover letter file name found in DB for order " + order.id.get + " but no corresponding file found")
      }
      Some(order.coverLetterFileName.get + "." + documentService.extensionPdf)
    } else {
      None
    }
  }

  private def getNewLinkedinProfileFileName(order: Order): Option[String] = {
    if (order.containedProductIds.contains(CruitedProduct.getFromType(CruitedProduct.DB_TYPE_LINKEDIN_PROFILE_REVIEW).id)) {
      // Fail epically if the Linkedin profile doesn't exist
      AccountDto.getOfId(order.accountId.get).get.linkedinProfile.get

      Some(order.id.get + Order.fileNamePrefixSeparator + documentService.linkedinProfilePdfFileNameWithoutPrefix)
    } else {
      None
    }
  }
}
