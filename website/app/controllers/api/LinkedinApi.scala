package controllers.api

import javax.inject.{Inject, Singleton}

import play.api.Play
import play.api.Play.current
import play.api.libs.json.JsValue
import play.api.libs.ws.WSClient
import play.api.mvc.Controller

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration.Duration
import scala.concurrent.{Await, Future}
import scala.util.{Failure, Success, Try}

@Singleton
class LinkedinApi @Inject()(val ws: WSClient) extends Controller {
  val linkedinClientId = Play.configuration.getString("linkedin.client.id").get
  val linkedinClientSecret = Play.configuration.getString("linkedin.client.secret").get
  val linkedinRequestedPermissions = Play.configuration.getString("linkedin.requestedPermissions").get
  val linkedinState = Play.configuration.getString("play.crypto.secret").get
  val linkedinAuthUri = Play.configuration.getString("linkedin.authUri").get
  val linkedinRedirectUri = Play.configuration.getString("linkedin.redirectUri").get
  val linkedinAccessTokenUri = Play.configuration.getString("linkedin.accessTokenUri").get
  val linkedinProfileDataUri = Play.configuration.getString("linkedin.profileDataUri").get

  var authCode: Option[String] = None
  var accessToken: Option[String] = None

  val linkedinAuthCodeRequestUrl = linkedinAuthUri +
    """?response_type=code""" +
    """&client_id=""" + linkedinClientId +
    """&redirect_uri=""" + linkedinRedirectUri +
    """&state=""" + linkedinState +
    """&scope=""" + linkedinRequestedPermissions

  def requestAccessToken() {
    val linkedinAccessTokenCallParams = Map(
      "grant_type" -> Seq("authorization_code"),
      "code" -> Seq(authCode.get),
      "redirect_uri" -> Seq(linkedinRedirectUri),
      "client_id" -> Seq(linkedinClientId),
      "client_secret" -> Seq(linkedinClientSecret))

    val futureAccessToken: Future[String] = ws.url(linkedinAccessTokenUri)
      .withHeaders("Content-Type" -> "application/x-www-form-urlencoded")
      .post(linkedinAccessTokenCallParams)
      .map {
      response => (response.json \ "access_token").as[String]
    }

    val accessTokenResult: Try[String] = Await.ready(futureAccessToken, Duration.Inf).value.get

    accessTokenResult match {
      case Success(token) => accessToken = Some(token)
      case Failure(e) => throw e
    }
  }

  def getProfile: JsValue = {
    accessToken match {
      case None => throw new Exception("Cannot get profile without access token first")
      case Some(token) =>
        val futureProfile: Future[JsValue] = ws.url(linkedinProfileDataUri)
          .withHeaders("Connection" -> "Keep-Alive")
          .withHeaders("Authorization" -> ("Bearer " + token))
          .get()
          .map {
          response => response.json
        }

        val profileResult: Try[JsValue] = Await.ready(futureProfile, Duration.Inf).value.get

        profileResult match {
          case Success(profile) => profile
          case Failure(e) => throw e
        }
    }
  }
}
