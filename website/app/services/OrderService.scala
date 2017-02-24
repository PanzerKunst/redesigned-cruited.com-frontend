package services

import java.util.Date
import javax.inject.{Inject, Singleton}

import db.{AccountDto, InterviewTrainingOrderInfoDto, OrderDto}
import models.{CruitedProduct, Order}
import play.api.Logger
import play.api.libs.json.JsNull

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

@Singleton
class OrderService @Inject()(val documentService: DocumentService) {
  def isTemporary(orderId: Long): Boolean = {
    orderId < 0
  }

  def finaliseOrder(order: Order): Long = {
    val orderId = order.id.get

    if (!isTemporary(orderId)) {
      throw new Exception("Cannot finalise a non-temp order")
    }

    // If the cost is 0, we set the status to paid
    val orderToBeFinalised = if (order.getCostAfterReductions == 0) {
      order.copy(
        status = Order.statusIdPaid,
        paymentTimestamp = Some(new Date().getTime)
      )
    } else {
      order.copy()
    }

    // Create finalised order, with data from the old one
    val finalisedOrderId = OrderDto.createFinalised(orderToBeFinalised).get
    val finalisedOrder = OrderDto.getOfId(finalisedOrderId).get

    finaliseInterviewTrainingOrderInfo(orderId, finalisedOrder)

    // Delete old order
    OrderDto.deleteOfId(orderId)

    Future {
      finaliseFileNames(finalisedOrder, orderId)
      val finalisedOrderWithPdfFileNames = convertDocsToPdf(finalisedOrder)
      generateDocThumbnails(finalisedOrderWithPdfFileNames)
    } onFailure {
      case e => Logger.error(e.getMessage, e)
    }

    finalisedOrderId
  }

  def convertDocsToPdf(order: Order): Order = {
    documentService.convertDocsToPdf(order.id.get)
    convertLinkedinPublicProfilePageToPdf(order)
    updateFileNamesInDb(order)
  }

  def generateDocThumbnails(order: Order) {
    Logger.info("OrderService.generateDocThumbnails() > order ID: " + order.id.get)

    generateThumbnailForFile(order.id.get, order.cvFileName)
    generateThumbnailForFile(order.id.get, order.coverLetterFileName)
    generateThumbnailForFile(order.id.get, order.linkedinProfileFileName)
  }

  private def finaliseFileNames(order: Order, oldOrderId: Long) {
    if (order.cvFileName.isDefined) {
      documentService.renameFile(order.cvFileName.get, oldOrderId, order.id.get)
    }
    if (order.coverLetterFileName.isDefined) {
      documentService.renameFile(order.coverLetterFileName.get, oldOrderId, order.id.get)
    }
    if (order.jobAdFileName.isDefined) {
      documentService.renameFile(order.jobAdFileName.get, oldOrderId, order.id.get)
    }
  }

  private def convertLinkedinPublicProfilePageToPdf(order: Order) {
    val linkedinProfile = AccountDto.getOfId(order.accountId.get).get.linkedinProfile

    if (order.containedProductCodes.contains(CruitedProduct.CodeLinkedinProfileReview) && linkedinProfile != JsNull) {
      documentService.convertLinkedinProfilePageToPdf(order.id.get, (linkedinProfile \ "publicProfileUrl").as[String])
    }
  }

  private def updateFileNamesInDb(order: Order): Order = {
    val orderWithPdfFileNames = order.copy(
      cvFileName = getNewCvFileName(order),
      coverLetterFileName = getNewCoverLetterFileName(order),
      linkedinProfileFileName = getNewLinkedinProfileFileName(order),
      jobAdFileName = getNewJobAdFileName(order)
    )

    OrderDto.update(orderWithPdfFileNames)

    orderWithPdfFileNames
  }

  private def getNewCvFileName(order: Order): Option[String] = {
    order.cvFileName match {
      case None => None
      case Some(fileName) => newFileName(order, fileName)
    }
  }

  private def getNewCoverLetterFileName(order: Order): Option[String] = {
    order.coverLetterFileName match {
      case None => None
      case Some(fileName) => newFileName(order, fileName)
    }
  }

  private def getNewJobAdFileName(order: Order): Option[String] = {
    order.jobAdFileName match {
      case None => None
      case Some(fileName) => newFileName(order, fileName)
    }
  }

  private def newFileName(order: Order, fileName: String): Option[String] = {
    val fileNameWithPdfExtension = if (documentService.getFileExtension(fileName) == documentService.extensionPdf) {
      fileName
    } else {
      fileName + "." + documentService.extensionPdf
    }

    if (!documentService.isFilePresent(order.id.get + Order.fileNamePrefixSeparator + fileNameWithPdfExtension)) {
      throw new Exception("OrderService.newFileName() > File name found in DB for order " + order.id.get + " but no corresponding file found")
    }
    Some(fileNameWithPdfExtension)
  }

  private def getNewLinkedinProfileFileName(order: Order): Option[String] = {
    if (order.containedProductCodes.contains(CruitedProduct.CodeLinkedinProfileReview) && order.accountId.get != AccountDto.unknownUserId) {
      // Fail epically if the Linkedin profile doesn't exist
      if (AccountDto.getOfId(order.accountId.get).get.linkedinProfile == JsNull) {
        throw new Exception("OrderService.getNewLinkedinProfileFileName() > Fatal error: linkedinProfile is JsNull for order ID " + order.id)
      }

      Some(documentService.linkedinProfilePdfFileNameWithoutPrefix)
    } else {
      None
    }
  }

  private def generateThumbnailForFile(orderId: Long, fileNameOpt: Option[String]) {
    Logger.info("OrderService.generateThumbnailForFile() > fileNameOpt: " + fileNameOpt)

    fileNameOpt match {
      case None =>
      case Some(fileNameWithoutPrefix) =>
        val fileName = orderId + Order.fileNamePrefixSeparator + fileNameWithoutPrefix

        if (documentService.isFilePresent(fileName)) {
          documentService.generateThumbnail(fileName)
        }
    }
  }

  private def finaliseInterviewTrainingOrderInfo(tempOrderId: Long, finalisedOrder: Order): Unit = {
    if (finalisedOrder.containedProductCodes.head == CruitedProduct.CodeInterviewTraining) {
      InterviewTrainingOrderInfoDto.getOfOrderId(tempOrderId) match {
        case None =>

        case Some(orderInfo) =>
          val finalisedInterviewTrainingOrderInfo = orderInfo.copy(
            orderId = finalisedOrder.id.get
          )

          InterviewTrainingOrderInfoDto.update(finalisedInterviewTrainingOrderInfo)
      }
    }
  }
}
