package services

import java.io.{FileOutputStream, File, FilenameFilter}
import javax.inject.{Inject, Singleton}

import models.Order
import org.apache.http.client.methods.HttpPost
import org.apache.http.entity.mime.{HttpMultipartMode, MultipartEntityBuilder}
import org.apache.http.impl.client.HttpClientBuilder
import play.api.Play
import play.api.Play.current
import play.api.libs.ws.WSClient

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.util.{Failure, Success}

@Singleton
class DocumentService @Inject()(val ws: WSClient) {
  val assessmentDocumentsRootDir = Play.configuration.getString("assessmentDocuments.RootDir").get
  val convertApiDotComToPdfFromWordUrl = Play.configuration.getString("convertapi.com.toPdf.fromWord.url").get
  val convertApiDotComToPdfFromOpenOfficeUrl = Play.configuration.getString("convertapi.com.toPdf.fromOpenOffice.url").get
  val convertApiDotComToPdfFromRichTextUrl = Play.configuration.getString("convertapi.com.toPdf.fromRichText.url").get
  val convertApiDotComToPdfFromWebUrl = Play.configuration.getString("convertapi.com.toPdf.fromWeb.url").get
  val convertApiDotComApiKey = Play.configuration.getString("convertapi.com.apiKey").get
  val linkedinProfilePdfFileNameWithoutPrefix = Play.configuration.getString("linkedinProfile.pdfFileName.withoutPrefix").get

  val extensionDoc = "doc"
  val extensionDocx = "docx"
  val extensionPdf = "pdf"
  val extensionOdt = "odt"
  val extensionRtf = "rtf"

  def renameFile(oldName: String, newName: String) {
    val oldFile = new File(assessmentDocumentsRootDir + oldName)
    if (!oldFile.exists) {
      throw new Exception("Trying to rename file " + oldName + " but it doesn't exist!")
    }
    val newFile = new File(assessmentDocumentsRootDir + newName)
    if (newFile.exists) {
      throw new Exception("Can't rename file " + oldName + " to " + newFile + " because the destination already exists!")
    }

    oldFile.renameTo(newFile)
  }

  def isFilePresent(fileName: String): Boolean = {
    new File(assessmentDocumentsRootDir + fileName).exists
  }

  def convertDocsToPdf(orderId: Long) {
    for (wordFile <- filesOfExtensionsForOrder(extensionDoc + "|" + extensionDocx, orderId)) {
      convertFileToPdf(wordFile, convertApiDotComToPdfFromWordUrl)
    }

    for (openOfficeFile <- filesOfExtensionsForOrder(extensionOdt, orderId)) {
      convertFileToPdf(openOfficeFile, convertApiDotComToPdfFromOpenOfficeUrl)
    }

    for (richTextFile <- filesOfExtensionsForOrder(extensionRtf, orderId)) {
      convertFileToPdf(richTextFile, convertApiDotComToPdfFromRichTextUrl)
    }
  }

  def convertLinkedinProfilePageToPdf(orderId: Long, linkedinPublicProfileUrl: String) {
    val wsCallParams = Map(
      "ApiKey" -> Seq(convertApiDotComApiKey),
      "CUrl" -> Seq(linkedinPublicProfileUrl))

    val futureByteArray: Future[Array[Byte]] = ws.url(convertApiDotComToPdfFromWebUrl)
      .post(wsCallParams)
      .map {
      response => response.bodyAsBytes
    }

    futureByteArray onComplete {
      case Failure(e) => throw e
      case Success(byteArray) =>
        val outputStream = new FileOutputStream(assessmentDocumentsRootDir + orderId + Order.fileNamePrefixSeparator + linkedinProfilePdfFileNameWithoutPrefix)
        try {
          outputStream.write(byteArray)
        } finally {
          outputStream.close()
        }
    }
  }

  def getFileExtension(fileName: String): String = {
    val lastDotIndex = fileName.lastIndexOf(".")
    fileName.substring(lastDotIndex + 1)
  }

  def generateDocThumbnails(orderId: Long) {

  }

  private def filesOfExtensionsForOrder(extensions: String, orderId: Long): List[File] = {
    val rootDir = new File(assessmentDocumentsRootDir)
    rootDir.listFiles(new FilenameFilter() {
      @Override
      def accept(dir: File, name: String): Boolean = {
        name.matches("^" + orderId + Order.fileNamePrefixSeparator + ".+\\.(" + extensions + ")$")
      }
    }).toList
  }

  private def convertFileToPdf(file: File, converterUrl: String) {
    val builder = MultipartEntityBuilder.create()
    builder.setMode(HttpMultipartMode.BROWSER_COMPATIBLE)
    builder.addBinaryBody("file", file)
    val httpEntity = builder.build()

    val httpPost = new HttpPost(converterUrl + "?ApiKey=" + convertApiDotComApiKey)
    httpPost.setEntity(httpEntity)

    val httpClient = HttpClientBuilder.create().build()

    try {
      val response = httpClient.execute(httpPost)
      val rcHeader = response.getFirstHeader("result")

      if (rcHeader.getValue != "True") {
        throw new Exception("Failure while calling " + httpPost.getURI + " for document " + file.getAbsolutePath)
      } else {
        val outputStream = new FileOutputStream(file.getAbsolutePath + ".pdf")
        try {
          response.getEntity.writeTo(outputStream)
        } finally {
          outputStream.close()
        }
      }
    } finally {
      httpClient.close()
    }
  }
}
