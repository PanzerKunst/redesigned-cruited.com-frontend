package controllers.api

import java.io.File
import javax.inject.Singleton

import play.api.mvc.{Action, Controller}
import services.{DocumentService, SessionService}

@Singleton
class OrderApi extends Controller {
  def create = Action(parse.multipartFormData) { request =>
    val requestBody = request.body
    val documentRootDirForAccount = DocumentService.getRootDirForAccountSession(request.session)

    requestBody.file("cvFile") match {
      case None =>
      case Some(cvFile) => cvFile.ref.moveTo(new File(documentRootDirForAccount + cvFile.filename))
    }

    requestBody.file("coverLetterFile") match {
      case None =>
      case Some(coverLetterFile) => coverLetterFile.ref.moveTo(new File(documentRootDirForAccount + coverLetterFile.filename))
    }

    Created
  }
}
