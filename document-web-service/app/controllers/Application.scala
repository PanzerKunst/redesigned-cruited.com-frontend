package controllers

import java.io.File
import javax.inject.Inject

import _root_.db.OrderDto
import play.api.mvc._
import services.DocumentService

class Application @Inject()(val documentService: DocumentService) extends Controller {
  def uploadOrderDocs = Action(parse.multipartFormData) { request =>
    /* request.body.file("picture").map { picture =>
      val filename = picture.filename
      val contentType = picture.contentType
      picture.ref.moveTo(new File(s"/tmp/picture/$filename"))
      Ok("File uploaded")
    }.getOrElse {
      Redirect(routes.Application.index).flashing(
        "error" -> "Missing file")
    } */

    request.body.file("picture") match {
      case None => Redirect("/").flashing(
        "error" -> "Missing file")
      case Some(picture) =>
        val filename = picture.filename
        val contentType = picture.contentType
        picture.ref.moveTo(new File(s"/tmp/picture/$filename"))
        Ok("File uploaded")
    }
  }

  def getCvOfOrder(orderId: Long) = Action {
    OrderDto.getOfId(orderId) match {
      case None => BadRequest("No order found for ID " + orderId)
      case Some(order) => sendFile(order.cvFileName)
    }
  }

  private def sendFile(fileNameOpt: Option[String]) = {
    fileNameOpt match {
      case None => NoContent
      case Some(fileName) => Ok.sendFile(
        content = new File(documentService.assessedDocumentsRootDir + fileName),
        inline = true
      )
    }
  }

  def getCoverLetterOfOrder(orderId: Long) = Action {
    OrderDto.getOfId(orderId) match {
      case None => BadRequest("No order found for ID " + orderId)
      case Some(order) => sendFile(order.coverLetterFileName)
    }
  }

  def getLinkedinProfileOfOrder(orderId: Long) = Action {
    OrderDto.getOfId(orderId) match {
      case None => BadRequest("No order found for ID " + orderId)
      case Some(order) => sendFile(order.linkedinProfileFileName)
    }
  }
}