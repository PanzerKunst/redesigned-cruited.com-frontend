package controllers.api

import java.io.File
import javax.inject.{Inject, Singleton}

import db.OrderDto
import models.Order
import models.frontend.OrderReceivedFromFrontend
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
      accountId = SessionService.getAccountId(request.session)
    )

    OrderDto.createTemporary(tempOrder)

    Created.withSession(request.session + (SessionService.SESSION_KEY_ORDER_ID -> tempOrderId.toString))
  }
}
