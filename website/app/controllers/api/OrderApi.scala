package controllers.api

import java.io.File
import java.text.SimpleDateFormat
import java.util.Date
import javax.inject.{Inject, Singleton}

import db.{AccountDto, OrderDto}
import models.frontend.OrderReceivedFromFrontend
import models.{Account, Order}
import play.api.i18n.{I18nSupport, Messages, MessagesApi}
import play.api.libs.json.Json
import play.api.mvc.{Action, Controller}
import services._

import scala.util.Random

@Singleton
class OrderApi @Inject()(val documentService: DocumentService, val messagesApi: MessagesApi, val emailService: EmailService) extends Controller with I18nSupport {
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
        Created(Json.toJson(OrderDto.getOfIdForFrontend(createdOrderId).get._1))
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
            existingOrder.creationTimestamp,
            existingOrder.paymentTimestamp
          ))

          Ok
      }
    }
  }

  def pay = Action { request =>
    SessionService.getAccountId(request.session) match {
      case None => Unauthorized
      case Some(accountId) =>
        OrderDto.getMostRecentUnpaidOfAccountId(accountId) match {
          case None => BadRequest("No unpaid order found for this account ID")
          case Some(order) =>
            val costAfterReductions = order.costAfterReductions

            if (costAfterReductions == 0) {
              BadRequest("Cannot pay an order whose cost after reductions is zero")
            } else {
              request.body.asText match {
                case None => BadRequest("Request body must contain the Paymill token")
                case Some(paymillToken) =>
                  // TODO PaymillService.doPayment(paymillToken, costAfterReductions, GlobalConfig.currencyCode)

                  val paidOrder = order.copy(
                    status = Order.statusIdPaid,
                    paymentTimestamp = Some(new Date().getTime)
                  )
                  OrderDto.update(paidOrder)

                  callSendPaidOrderCompleteEmail(AccountDto.getOfId(accountId).get, paidOrder, costAfterReductions)

                  Ok
              }
            }
        }
    }
  }

  private def callSendPaidOrderCompleteEmail(account: Account, order: Order, costAfterReductions: Int): Unit = {
    var orderedProducts = Messages("product.name." + order.containedProductCodes.head)
    if (order.containedProductCodes.length > 1) {
      orderedProducts = orderedProducts + " " + Messages("email.orderComplete.paid.orderedProductsSeparator") + " " + Messages("product.name." + order.containedProductCodes.apply(1))
    }
    if (order.containedProductCodes.length > 2) {
      orderedProducts = orderedProducts + " " + Messages("email.orderComplete.paid.orderedProductsSeparator") + " " + Messages("product.name." + order.containedProductCodes.apply(2))
    }

    val vatAmount = NumberService.roundAt(2, costAfterReductions * 0.2)

    val datetimeFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm")
    val orderDateTime = datetimeFormat.format(new Date(order.paymentTimestamp.get))

    emailService.sendPaidOrderCompleteEmail(account.emailAddress.get, account.firstName.get, orderedProducts, order.id.get, costAfterReductions, GlobalConfig.currencyCode, vatAmount, orderDateTime, Messages("email.orderComplete.paid.subject"))
  }
}
