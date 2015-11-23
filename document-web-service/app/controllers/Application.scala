package controllers

import java.io.File
import javax.inject.Inject

import _root_.db.OrderDto
import models.Order
import play.api.mvc._
import services.{DocumentService, GlobalConfig, OrderService}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class Application @Inject()(val documentService: DocumentService, val orderService: OrderService) extends Controller {
  def preFlight = Action { request =>
    Ok.withHeaders(
      ACCESS_CONTROL_ALLOW_ORIGIN -> GlobalConfig.allowedAccessControlOrigin,
      ACCESS_CONTROL_ALLOW_METHODS -> "POST, PUT, OPTIONS",
      ACCESS_CONTROL_ALLOW_HEADERS -> s"$ORIGIN, X-Requested-With, $CONTENT_TYPE, $ACCEPT, $AUTHORIZATION, X-Auth-Token",
      ACCESS_CONTROL_ALLOW_CREDENTIALS -> "true")
  }

  def create = CorsAction() {
    Action(parse.multipartFormData) { request =>
      val requestBody = request.body
      val requestData = requestBody.dataParts

      if (!requestData.contains("orderId")) {
        BadRequest("'orderId' required")
      } else {
        val orderId = requestData("orderId").head.toLong

        OrderDto.getOfId(orderId) match {
          case None => BadRequest("No order found in database for order ID " + orderId)
          case Some(order) =>
            var result: Result = Created

            val newCvFileName = requestBody.file("cvFile") match {
              case None => None
              case Some(cvFile) =>
                if (order.cvFileName.isDefined) {
                  result = Forbidden("A CV file was already uploaded for this order. If you want to replace it, do a 'PUT' request instead of 'POST'")
                  None
                } else {
                  val fileName = orderId + Order.fileNamePrefixSeparator + cvFile.filename
                  cvFile.ref.moveTo(new File(documentService.assessedDocumentsRootDir + fileName))
                  Some(fileName)
                }
            }

            val newCoverLetterFileName = requestBody.file("coverLetterFile") match {
              case None => None
              case Some(coverLetterFile) =>
                if (order.coverLetterFileName.isDefined) {
                  result = Forbidden("A cover letter file was already uploaded for this order. If you want to replace it, do a 'PUT' request instead of 'POST'")
                  None
                } else {
                  val fileName = orderId + Order.fileNamePrefixSeparator + coverLetterFile.filename
                  coverLetterFile.ref.moveTo(new File(documentService.assessedDocumentsRootDir + fileName))
                  Some(fileName)
                }
            }

            if (result == Created) {
              val updatedOrder = order.copy(
                cvFileName = newCvFileName,
                coverLetterFileName = newCoverLetterFileName
              )

              OrderDto.update(updatedOrder)

              Future {
                orderService.convertDocsToPdf(orderId)
                orderService.generateDocThumbnails(orderId)
              }
            }

            result
        }
      }
    }
  }

  def update = CorsAction() {
    Action(parse.multipartFormData) { request =>
      val requestBody = request.body
      val requestData = requestBody.dataParts

      if (!requestData.contains("orderId")) {
        BadRequest("'orderId' required")
      } else {
        val orderId = requestData("orderId").head.toLong

        OrderDto.getOfId(orderId) match {
          case None => BadRequest("No order found in database for order ID " + orderId)
          case Some(order) =>
            var result: Result = Ok

            val newCvFileName = requestBody.file("cvFile") match {
              case None => None
              case Some(cvFile) =>
                order.cvFileName match {
                  case None =>
                    result = Forbidden("This order contains no CV file. If you want to add one, do a 'POST' request instead of 'PUT'")
                    None
                  case Some(existingCvFileName) =>
                    //deleteDocumentFile(existingCvFileName)

                    val fileName = orderId + Order.fileNamePrefixSeparator + cvFile.filename
                    cvFile.ref.moveTo(new File(documentService.assessedDocumentsRootDir + fileName))
                    Some(fileName)
                }
            }

            val newCoverLetterFileName = requestBody.file("coverLetterFile") match {
              case None => None
              case Some(coverLetterFile) =>
                order.coverLetterFileName match {
                  case None =>
                    result = Forbidden("This order contains no cover letter file. If you want to add one, do a 'POST' request instead of 'PUT'")
                    None
                  case Some(existingCoverLetterFileName) =>
                    //deleteDocumentFile(existingCoverLetterFileName)

                    val fileName = orderId + Order.fileNamePrefixSeparator + coverLetterFile.filename
                    coverLetterFile.ref.moveTo(new File(documentService.assessedDocumentsRootDir + fileName))
                    Some(fileName)
                }
            }

            if (result == Ok) {
              val updatedOrder = order.copy(
                cvFileName = newCvFileName,
                coverLetterFileName = newCoverLetterFileName
              )

              OrderDto.update(updatedOrder)

              Future {
                orderService.convertDocsToPdf(orderId)
                orderService.generateDocThumbnails(orderId)
              }
            }

            result
        }
      }
    }
  }

  def getCvOfOrder(orderId: Long) = Action { request =>
    OrderDto.getOfId(orderId) match {
      case None => BadRequest("No order found for ID " + orderId)
      case Some(order) => sendDocument(order.cvFileName)
    }
  }

  private def sendDocument(fileNameOpt: Option[String]) = {
    fileNameOpt match {
      case None => NoContent
      case Some(fileName) => Ok.sendFile(
        content = new File(documentService.assessedDocumentsRootDir + fileName),
        inline = true
      )
    }
  }

  def getCoverLetterOfOrder(orderId: Long) = Action { request =>
    OrderDto.getOfId(orderId) match {
      case None => BadRequest("No order found for ID " + orderId)
      case Some(order) => sendDocument(order.coverLetterFileName)
    }
  }

  def getLinkedinProfileOfOrder(orderId: Long) = Action { request =>
    OrderDto.getOfId(orderId) match {
      case None => BadRequest("No order found for ID " + orderId)
      case Some(order) => sendDocument(order.linkedinProfileFileName)
    }
  }

  def getCvThumbnailOfOrder(orderId: Long) = Action { request =>
    OrderDto.getOfId(orderId) match {
      case None => BadRequest("No order found for ID " + orderId)
      case Some(order) =>
        sendThumbnail(order.cvFileName)
    }
  }

  def getCoverLetterThumbnailOfOrder(orderId: Long) = Action { request =>
    OrderDto.getOfId(orderId) match {
      case None => BadRequest("No order found for ID " + orderId)
      case Some(order) =>
        sendThumbnail(order.coverLetterFileName)
    }
  }

  def getLinkedinProfileThumbnailOfOrder(orderId: Long) = Action { request =>
    OrderDto.getOfId(orderId) match {
      case None => BadRequest("No order found for ID " + orderId)
      case Some(order) =>
        sendThumbnail(order.linkedinProfileFileName)
    }
  }

  private def sendThumbnail(docFileNameOpt: Option[String]) = {
    docFileNameOpt match {
      case None => NoContent
      case Some(docFileName) =>
        val thumbnailFileName = documentService.getFileNameWithoutExtension(docFileName) + "." + documentService.docThumbnailFileExtension

        Ok.sendFile(
          content = new File(documentService.assessedDocumentsThumbnailsRootDir + thumbnailFileName),
          inline = true
        )
    }
  }

  // Not used, but to keep
  private def deleteDocumentFile(fileName: String) = {
    val file = new File(documentService.assessedDocumentsRootDir + fileName)
    if (!file.exists()) {
      throw new Exception("FATAL ERROR: Order contains a value in DB for cvFileName, but no corresponding file found")
    }
    val isDeletionSuccessful = file.delete()
    if (!isDeletionSuccessful) {
      throw new Exception("FATAL ERROR: Failed to delete " + fileName + " for an unknown reason")
    }
  }
}
