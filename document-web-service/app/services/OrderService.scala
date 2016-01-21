package services

import javax.inject.{Inject, Singleton}

import db.{AccountDto, OrderDto}
import models.{CruitedProduct, Order}
import play.api.Logger
import play.api.libs.json.JsNull

@Singleton
class OrderService @Inject()(val documentService: DocumentService) {
  // TODO: remove 2nd arg when the new App pages are released
  def convertDocsToPdf(order: Order, linkedinPublicProfileUrlOpt: Option[String] = None): Order = {
    documentService.convertDocsToPdf(order.id.get)

    linkedinPublicProfileUrlOpt match {
      case None =>
        convertLinkedinPublicProfilePageToPdf(order)
        updateFileNamesInDb(order)

      case Some(linkedinPublicProfileUrl) =>
        legacyConvertLinkedinPublicProfilePageToPdf(order, linkedinPublicProfileUrl)

        val orderWithPdfFileNames = order.copy(
          cvFileName = getNewCvFileName(order),
          coverLetterFileName = getNewCoverLetterFileName(order),
          linkedinProfileFileName = Some(GlobalConfig.linkedinProfilePdfFileNameWithoutPrefix)
        )
        OrderDto.update(orderWithPdfFileNames)
        orderWithPdfFileNames
    }
  }

  private def convertLinkedinPublicProfilePageToPdf(order: Order) {
    val linkedinProfile = AccountDto.getOfId(order.accountId.get).get.linkedinProfile

    if (order.containedProductCodes.contains(CruitedProduct.codeLinkedinProfileReview) && linkedinProfile != JsNull) {
      documentService.convertLinkedinProfilePageToPdf(order.id.get, (linkedinProfile \ "publicProfileUrl").as[String])
    }
  }

  // TODO: delete when the new App pages are released
  private def legacyConvertLinkedinPublicProfilePageToPdf(order: Order, linkedinPublicProfileUrl: String) {
    if (order.containedProductCodes.contains(CruitedProduct.codeLinkedinProfileReview)) {
      documentService.convertLinkedinProfilePageToPdf(order.id.get, linkedinPublicProfileUrl)
    }
  }

  private def updateFileNamesInDb(order: Order): Order = {
    val orderWithPdfFileNames = order.copy(
      cvFileName = getNewCvFileName(order),
      coverLetterFileName = getNewCoverLetterFileName(order),
      linkedinProfileFileName = getNewLinkedinProfileFileName(order)
    )

    OrderDto.update(orderWithPdfFileNames)

    orderWithPdfFileNames
  }

  private def getNewCvFileName(order: Order): Option[String] = {
    order.cvFileName match {
      case None => None
      case Some(fileName) =>
        val fileNameWithPdfExtension = if (documentService.getFileExtension(fileName) == documentService.extensionPdf) {
          fileName
        } else {
          fileName + "." + documentService.extensionPdf
        }

        if (!documentService.isFilePresent(order.id.get + Order.fileNamePrefixSeparator + fileNameWithPdfExtension)) {
          throw new Exception("OrderService.getNewCvFileName() > CV file name found in DB for order " + order.id.get + " but no corresponding file found")
        }
        Some(fileNameWithPdfExtension)
    }
  }

  private def getNewCoverLetterFileName(order: Order): Option[String] = {
    order.coverLetterFileName match {
      case None => None
      case Some(fileName) =>
        val fileNameWithPdfExtension = if (documentService.getFileExtension(fileName) == documentService.extensionPdf) {
          fileName
        } else {
          fileName + "." + documentService.extensionPdf
        }

        if (!documentService.isFilePresent(order.id.get + Order.fileNamePrefixSeparator + fileNameWithPdfExtension)) {
          throw new Exception("OrderService.getNewCoverLetterFileName() > Cover letter file name found in DB for order " + order.id.get + " but no corresponding file found")
        }
        Some(fileNameWithPdfExtension)
    }
  }

  private def getNewLinkedinProfileFileName(order: Order): Option[String] = {
    if (order.containedProductCodes.contains(CruitedProduct.codeLinkedinProfileReview) && order.accountId.get != AccountDto.unknownUserId) {
      // Fail epically if the Linkedin profile doesn't exist
      if (AccountDto.getOfId(order.accountId.get).get.linkedinProfile == JsNull) {
        throw new Exception("OrderService.getNewLinkedinProfileFileName() > Fatal error: linkedinProfile is JsNull for order ID " + order.id)
      }

      Some(GlobalConfig.linkedinProfilePdfFileNameWithoutPrefix)
    } else {
      None
    }
  }

  def generateDocThumbnails(order: Order) {

    // TODO: remove
    Logger.info("OrderService > generateDocThumbnails: " + order.id.get)

    generateThumbnailForFile(order.id.get, order.cvFileName)
    generateThumbnailForFile(order.id.get, order.coverLetterFileName)
    generateThumbnailForFile(order.id.get, order.linkedinProfileFileName)
  }

  private def generateThumbnailForFile(orderId: Long, fileNameOpt: Option[String]) {

    // TODO: remove
    Logger.info("OrderService > generateThumbnailForFile: " + fileNameOpt)

    fileNameOpt match {
      case None =>
      case Some(fileNameWithoutPrefix) =>
        val fileName = orderId + Order.fileNamePrefixSeparator + fileNameWithoutPrefix

        if (documentService.isFilePresent(fileName)) {
          documentService.generateThumbnail(fileName)
        }
    }
  }
}
