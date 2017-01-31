package services

import java.awt.image.BufferedImage
import java.io.{File, FileOutputStream, FilenameFilter}
import javax.inject.{Inject, Singleton}

import models.Order
import org.apache.http.client.methods.HttpPost
import org.apache.http.entity.mime.{HttpMultipartMode, MultipartEntityBuilder}
import org.apache.http.impl.client.HttpClientBuilder
import org.apache.pdfbox.pdmodel.{PDDocument, PDPage}
import org.apache.pdfbox.util.ImageIOUtil
import org.imgscalr.Scalr
import play.api.{Logger, Play}
import play.api.Play.current
import play.api.libs.ws.WSClient

import scala.collection.JavaConverters._
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration.Duration
import scala.concurrent.{Await, Future}
import scala.util.{Failure, Success, Try}

@Singleton
class DocumentService @Inject()(val ws: WSClient) {
  val assessedDocumentsRootDir = Play.configuration.getString("assessedDocuments.rootDir").get
  val assessedDocumentsThumbnailsRootDir = Play.configuration.getString("assessedDocuments.thumbnails.rootDir").get
  val convertApiDotComToPdfFromWordUrl = Play.configuration.getString("convertapi.com.toPdf.fromWord.url").get
  val convertApiDotComToPdfFromOpenOfficeUrl = Play.configuration.getString("convertapi.com.toPdf.fromOpenOffice.url").get
  val convertApiDotComToPdfFromRichTextUrl = Play.configuration.getString("convertapi.com.toPdf.fromRichText.url").get
  val convertApiDotComToPdfFromWebUrl = Play.configuration.getString("convertapi.com.toPdf.fromWeb.url").get
  val convertApiDotComApiKey = Play.configuration.getString("convertapi.com.apiKey").get
  val docThumbnailFileExtension = Play.configuration.getString("docThumbnail.fileExtension").get
  val docThumbnailWidthPxHdpi = Play.configuration.getInt("docThumbnail.widthPxHdpi").get

  val extensionDoc = "doc"
  val extensionDocx = "docx"
  val extensionPdf = "pdf"
  val extensionOdt = "odt"
  val extensionRtf = "rtf"

  def renameFile(name: String, oldOrderId: Long, orderId: Long) {
    val oldName = oldOrderId + Order.fileNamePrefixSeparator + name
    val newName = orderId + Order.fileNamePrefixSeparator + name

    val oldFile = new File(assessedDocumentsRootDir + oldName)
    if (!oldFile.exists) {
      throw new Exception("Trying to rename file " + oldName + " but it doesn't exist!")
    }
    val newFile = new File(assessedDocumentsRootDir + newName)
    if (newFile.exists) {
      throw new Exception("Can't rename file " + oldName + " to " + newName + " because the destination already exists!")
    }

    oldFile.renameTo(newFile)
  }

  def isFilePresent(fileName: String): Boolean = {
    new File(assessedDocumentsRootDir + fileName).exists
  }

  def getFileExtension(fileName: String): String = {
    val lastDotIndex = fileName.lastIndexOf(".")
    fileName.substring(lastDotIndex + 1).toLowerCase
  }

  def getFileNameWithoutExtension(fileName: String): String = {
    val lastDotIndex = fileName.lastIndexOf(".")

    fileName.substring(0, lastDotIndex)
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
      .map { response => response.bodyAsBytes }

    // We wait for the call to be complete before continuing the program, because we need the file to be there for thumbnail generation
    val byteArrayResult: Try[Array[Byte]] = Await.ready(futureByteArray, Duration.Inf).value.get

    byteArrayResult match {
      case Failure(e) => throw e
      case Success(byteArray) =>
        val outputStream = new FileOutputStream(assessedDocumentsRootDir + orderId + Order.fileNamePrefixSeparator + GlobalConfig.linkedinProfilePdfFileNameWithoutPrefix)
        try {
          outputStream.write(byteArray)
        } finally {
          outputStream.close()
        }
    }
  }

  def generateThumbnail(fileName: String) {
    Logger.info("DocumentService.generateThumbnail() > generating thumbnail for file: " + fileName)

    val pdfPath = assessedDocumentsRootDir + fileName
    val imgPath = assessedDocumentsThumbnailsRootDir + getFileNameWithoutExtension(fileName) + "." + docThumbnailFileExtension

    val document = PDDocument.loadNonSeq(new File(pdfPath), null)
    val pdPages = document.getDocumentCatalog.getAllPages.asScala
    val img = pdPages.head.asInstanceOf[PDPage].convertToImage(BufferedImage.TYPE_INT_RGB, 300)

    val resizedImg = Scalr.resize(img, Scalr.Method.ULTRA_QUALITY, Scalr.Mode.FIT_TO_WIDTH, docThumbnailWidthPxHdpi, 0, Scalr.OP_ANTIALIAS)
    ImageIOUtil.writeImage(resizedImg, imgPath, 300)

    resizedImg.flush()
    img.flush()
    document.close()

    Logger.info("DocumentService.generateThumbnail() > Thumbnail for file: " + fileName + " generated successfully")
  }

  private def filesOfExtensionsForOrder(extensions: String, orderId: Long): List[File] = {
    val rootDir = new File(assessedDocumentsRootDir)
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
        Logger.error("Failure while calling " + httpPost.getURI + " for document " + file.getAbsolutePath)
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
