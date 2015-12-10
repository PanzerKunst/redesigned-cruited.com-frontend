package controllers.api

import java.io.File
import javax.inject.{Inject, Singleton}

import db.OrderDto
import models.Order
import models.frontend.OrderReceivedFromFrontend
import play.api.libs.json.Json
import play.api.mvc.{Action, Controller}
import services.{DocumentService, SessionService}

import scala.util.Random

@Singleton
class OrderApi @Inject()(val documentService: DocumentService) extends Controller {
  def create = Action(parse.multipartFormData) { request =>
    // We only want to generate negative IDs, because positive ones are for non-temp orders
    val rand = Random.nextLong()
    val tempOrderId = if (rand >= 0) {
      -rand
    } else {
      rand
    }


    val requestBody = request.body

    // Saving files in "documents" folder
    val cvFileNameOpt = requestBody.file("cvFile") match {
      case None => None
      case Some(cvFile) =>
        val fileName = tempOrderId + Order.fileNamePrefixSeparator + cvFile.filename
        cvFile.ref.moveTo(new File(documentService.assessedDocumentsRootDir + fileName))
        Some(fileName)
    }

    val coverLetterFileNameOpt = requestBody.file("coverLetterFile") match {
      case None => None
      case Some(coverLetterFile) =>
        val fileName = tempOrderId + Order.fileNamePrefixSeparator + coverLetterFile.filename
        coverLetterFile.ref.moveTo(new File(documentService.assessedDocumentsRootDir + fileName))
        Some(fileName)
    }


    val requestData = requestBody.dataParts

    val couponCode = if (!requestData.contains("couponCode")) {
      None
    } else {
      Some(requestData("couponCode").head)
    }

    val positionSought = if (!requestData.contains("positionSought")) {
      None
    } else {
      Some(requestData("positionSought").head)
    }

    val employerSought = if (!requestData.contains("employerSought")) {
      None
    } else {
      Some(requestData("employerSought").head)
    }

    val jobAdUrl = if (!requestData.contains("jobAdUrl")) {
      None
    } else {
      Some(requestData("jobAdUrl").head)
    }

    val customerComment = if (!requestData.contains("customerComment")) {
      None
    } else {
      Some(requestData("customerComment").head)
    }

    // Create temporary order
    val tempOrder = OrderReceivedFromFrontend(
      tempId = tempOrderId,
      editionId = requestData("editionId").head.toLong,
      containedProductCodes = requestData("containedProductCodes").head.split(",").toList,
      couponCode = couponCode,
      cvFileName = cvFileNameOpt,
      coverLetterFileName = coverLetterFileNameOpt,
      positionSought = positionSought,
      employerSought = employerSought,
      jobAdUrl = jobAdUrl,
      customerComment = customerComment,
      accountId = SessionService.getAccountId(request.session)
    )

    OrderDto.createTemporary(tempOrder) match {
      case None => throw new Exception("OrderDto.createTemporary didn't return an ID!")
      case Some(createdOrderId) =>
        Created(Json.toJson(OrderDto.getOfIdForFrontend(createdOrderId)))
          .withSession(request.session + (SessionService.sessionKeyOrderId -> tempOrderId.toString))
    }
  }

  def update = Action(parse.multipartFormData) { request =>
    val requestBody = request.body
    val requestData = requestBody.dataParts

    if (!requestData.contains("id")) {
      BadRequest("'id' required")
    } else {
      val id = requestData("id").head.toLong

      OrderDto.getOfId(id) match {
        case None => BadRequest("No order found for ID " + id)
        case Some(existingOrder) =>
          // Saving files in "documents" folder
          val cvFileNameOpt = requestBody.file("cvFile") match {
            case None => None
            case Some(cvFile) =>
              val fileName = id + Order.fileNamePrefixSeparator + cvFile.filename
              cvFile.ref.moveTo(new File(documentService.assessedDocumentsRootDir + fileName))
              Some(fileName)
          }

          val coverLetterFileNameOpt = requestBody.file("coverLetterFile") match {
            case None => None
            case Some(coverLetterFile) =>
              val fileName = id + Order.fileNamePrefixSeparator + coverLetterFile.filename
              coverLetterFile.ref.moveTo(new File(documentService.assessedDocumentsRootDir + fileName))
              Some(fileName)
          }


          val positionSought = if (!requestData.contains("positionSought")) {
            None
          } else {
            Some(requestData("positionSought").head)
          }

          val employerSought = if (!requestData.contains("employerSought")) {
            None
          } else {
            Some(requestData("employerSought").head)
          }

          val jobAdUrl = if (!requestData.contains("jobAdUrl")) {
            None
          } else {
            Some(requestData("jobAdUrl").head)
          }

          val customerComment = if (!requestData.contains("customerComment")) {
            None
          } else {
            Some(requestData("customerComment").head)
          }

          OrderDto.update(Order(
            Some(id),
            existingOrder.editionId,
            existingOrder.containedProductCodes,
            existingOrder.couponId,
            cvFileNameOpt,
            coverLetterFileNameOpt,
            existingOrder.linkedinProfileFileName,
            positionSought,
            employerSought,
            jobAdUrl,
            customerComment,
            existingOrder.accountId,
            existingOrder.status,
            existingOrder.creationTimestamp
          ))

          Ok
      }
    }
  }
}
