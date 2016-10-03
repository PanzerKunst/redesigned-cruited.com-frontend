package controllers.api

import java.io.File
import java.text.SimpleDateFormat
import java.util.Date
import javax.inject.{Inject, Singleton}

import db.{AccountDto, OrderDto}
import models.frontend.OrderReceivedFromFrontend
import models.{Account, Order}
import play.api.i18n.MessagesApi
import play.api.libs.json.Json
import play.api.mvc.{Session, Action, Controller}
import services._

import scala.util.Random

@Singleton
class OrderApi @Inject()(val documentService: DocumentService, val messagesApi: MessagesApi, val emailService: EmailService) extends Controller {
  def create() = Action(parse.multipartFormData) { request =>
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
      case Some(file) =>
        val fileExtension = documentService.getFileExtension(file.filename)
        val fileName = tempOrderId + Order.fileNamePrefixSeparator + "CV." + fileExtension
        file.ref.moveTo(new File(documentService.assessedDocumentsRootDir + fileName))
        Some(fileName)
    }

    val coverLetterFileNameOpt = requestBody.file("coverLetterFile") match {
      case None => None
      case Some(file) =>
        val fileExtension = documentService.getFileExtension(file.filename)
        val fileName = tempOrderId + Order.fileNamePrefixSeparator + "cover-letter." + fileExtension
        file.ref.moveTo(new File(documentService.assessedDocumentsRootDir + fileName))
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

    val currentLanguage = SessionService.getCurrentLanguage(request.session)

    OrderDto.createTemporary(tempOrder, currentLanguage) match {
      case None => throw new Exception("OrderDto.createTemporary didn't return an ID!")
      case Some(createdOrderId) =>
        Created(Json.toJson(OrderDto.getOfIdForFrontend(createdOrderId).get._1))
          .withSession(request.session + (SessionService.sessionKeyOrderId -> tempOrderId.toString))
    }
  }

  def update() = Action(parse.multipartFormData) { request =>
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
              Some(cvFile.filename)
          }

          val coverLetterFileNameOpt = requestBody.file("coverLetterFile") match {
            case None => None
            case Some(coverLetterFile) =>
              val fileName = id + Order.fileNamePrefixSeparator + coverLetterFile.filename
              coverLetterFile.ref.moveTo(new File(documentService.assessedDocumentsRootDir + fileName))
              Some(coverLetterFile.filename)
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
            existingOrder.languageCode,
            existingOrder.creationTimestamp,
            existingOrder.paymentTimestamp
          ))

          Ok
      }
    }
  }

  def pay() = Action { request =>
    SessionService.getAccountId(request.session) match {
      case None => Unauthorized(views.html.unauthorised())
      case Some(accountId) =>
        OrderDto.getMostRecentUnpaidOfAccountId(accountId) match {
          case None => BadRequest("No unpaid order found for this account ID")
          case Some(order) =>
            val costAfterReductions = order.getCostAfterReductions

            if (costAfterReductions == 0) {
              BadRequest("Cannot pay an order whose cost after reductions is zero")
            } else {
              request.body.asText match {
                case None => BadRequest("Request body must contain the Paymill token")
                case Some(paymillToken) =>
                  try {
                    PaymillService.doPayment(paymillToken, costAfterReductions, order)

                    val paidOrder = order.copy(
                      status = Order.statusIdPaid,
                      paymentTimestamp = Some(new Date().getTime)
                    )
                    OrderDto.update(paidOrder)

                    callSendPaidOrderCompleteEmail(AccountDto.getOfId(accountId).get, paidOrder, costAfterReductions, request.session)

                    Ok
                  }
                  catch {
                    case pe: PaymentException => Status(HttpService.httpStatusPaymillError).apply(pe.getMessage)
                  }
              }
            }
        }
    }
  }

  private def callSendPaidOrderCompleteEmail(account: Account, order: Order, costAfterReductions: Int, session: Session) {
    val language = SessionService.getCurrentLanguage(session)
    val i18nMessages = I18nService.getMessages(messagesApi, language.ietfCode)

    var orderedProducts = i18nMessages("product.name." + order.containedProductCodes.head)
    if (order.containedProductCodes.length > 1) {
      orderedProducts = orderedProducts + " " + i18nMessages("email.orderComplete.paid.orderedProductsSeparator") + " " + i18nMessages("product.name." + order.containedProductCodes.apply(1))
    }
    if (order.containedProductCodes.length > 2) {
      orderedProducts = orderedProducts + " " + i18nMessages("email.orderComplete.paid.orderedProductsSeparator") + " " + i18nMessages("product.name." + order.containedProductCodes.apply(2))
    }

    val vatAmount = NumberService.roundAt(2, costAfterReductions * 0.2)

    val datetimeFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm")
    val orderDateTime = datetimeFormat.format(new Date(order.paymentTimestamp.get))

    emailService.sendPaidOrderCompleteEmail(account.emailAddress.get, account.firstName.get, language.ietfCode, orderedProducts, order.id.get, costAfterReductions, vatAmount, orderDateTime, i18nMessages("email.orderComplete.paid.subject"))
  }
}
