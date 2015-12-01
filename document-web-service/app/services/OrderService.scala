package services

import javax.inject.{Inject, Singleton}

import db.{AccountDto, OrderDto}
import models.{CruitedProduct, Order}
import play.api.Logger
import play.api.libs.json.JsNull

@Singleton
class OrderService @Inject()(val documentService: DocumentService) {
  def convertDocsToPdf(orderId: Long, linkedinPublicProfileUrlOpt: Option[String]) {
    documentService.convertDocsToPdf(orderId)
    convertLinkedinPublicProfilePageToPdf(orderId, linkedinPublicProfileUrlOpt)
    updateFileNamesInDb(orderId)
  }

  private def convertLinkedinPublicProfilePageToPdf(orderId: Long, linkedinPublicProfileUrlOpt: Option[String]) {
    linkedinPublicProfileUrlOpt match {
      case Some(linkedinPublicProfileUrl) => documentService.convertLinkedinProfilePageToPdf(orderId, linkedinPublicProfileUrl)
      case None =>
        val accountId = OrderDto.getOfId(orderId).get.accountId.get
        val linkedinProfile = AccountDto.getOfId(accountId).get.linkedinProfile

        if (linkedinProfile != JsNull) {
          documentService.convertLinkedinProfilePageToPdf(orderId, (linkedinProfile \ "publicProfileUrl").as[String])
        }
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
    if (order.containedProductCodes.contains(CruitedProduct.getCodeFromType(CruitedProduct.dbTypeLinkedinProfileReview)) &&
      order.accountId.get != AccountDto.unknownUserId) {
      // Fail epically if the Linkedin profile doesn't exist
      if (AccountDto.getOfId(order.accountId.get).get.linkedinProfile == JsNull) {
        throw new Exception("OrderService.getNewLinkedinProfileFileName() > Fatal error: linkedinProfile is JsNull for order ID " + order.id)
      }

      Some(order.id.get + Order.fileNamePrefixSeparator + GlobalConfig.linkedinProfilePdfFileNameWithoutPrefix)
    } else {
      None
    }
  }

  def generateDocThumbnails(orderId: Long) {

    // TODO: remove
    Logger.info("OrderService > generateDocThumbnails: " + orderId)

    val order = OrderDto.getOfId(orderId).get

    generateThumbnailForFile(order.cvFileName)
    generateThumbnailForFile(order.coverLetterFileName)
    generateThumbnailForFile(order.linkedinProfileFileName)
  }

  private def generateThumbnailForFile(fileNameOpt: Option[String]) {

    // TODO: remove
    Logger.info("OrderService > generateThumbnailForFile: " + fileNameOpt)

    fileNameOpt match {
      case None =>
      case Some(fileName) =>
        if (documentService.isFilePresent(fileName)) {
          documentService.generateThumbnail(fileName)
        }
    }
  }
}
