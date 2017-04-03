package controllers.api

import java.text.SimpleDateFormat
import java.util.Date
import javax.inject.{Inject, Singleton}

import db.{AccountDto, InterviewTrainingOrderInfoDto, OrderDto}
import models.frontend.OrderReceivedFromFrontend
import models.{Account, InterviewTrainingOrderInfo, Order}
import play.api.Logger
import play.api.i18n.MessagesApi
import play.api.libs.json.Json
import play.api.mvc.{Action, Controller, Session}
import services._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.util.Random

@Singleton
class OrderApi @Inject()(val documentService: DocumentService, val orderService: OrderService, val messagesApi: MessagesApi, val emailService: EmailService) extends Controller {
  def create() = Action(parse.multipartFormData) { request =>
    // We only want to generate negative IDs, because positive ones are for non-temp orders
    val rand = Random.nextLong()
    val tempOrderId = if (rand >= 0) {
      -rand
    } else {
      rand
    }


    val requestBody = request.body

    val cvFileNameOpt = requestBody.file("cvFile") match {
      case None => None
      case Some(file) => Some(documentService.saveFileInDocumentsFolder(file, tempOrderId, documentService.middleFileNameCv))
    }

    val coverLetterFileNameOpt = requestBody.file("coverLetterFile") match {
      case None => None
      case Some(file) => Some(documentService.saveFileInDocumentsFolder(file, tempOrderId, documentService.middleFileNameCoverLetter))
    }

    val jobAdFileNameOpt = requestBody.file("jobAdFile") match {
      case None => None
      case Some(file) => Some(documentService.saveFileInDocumentsFolder(file, tempOrderId, documentService.middleFileNameJobAd))
    }


    val requestData = requestBody.dataParts

    val couponCode = if (!requestData.contains("couponCode")) {
      None
    } else {
      Some(requestData("couponCode").head)
    }

    val linkedinProfileLangOpt = if (!requestData.contains("linkedinProfileLanguage")) {
      None
    } else {
      Some(requestData("linkedinProfileLanguage").head)
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
      editionId = Some(requestData("editionId").head.toLong),
      containedProductCodes = requestData("containedProductCodes").head.split(",").toList,
      couponCode = couponCode,
      cvFileName = cvFileNameOpt,
      coverLetterFileName = coverLetterFileNameOpt,
      positionSought = positionSought,
      employerSought = employerSought,
      jobAdUrl = jobAdUrl,
      jobAdFileName = jobAdFileNameOpt,
      linkedinProfileLanguage = linkedinProfileLangOpt,
      customerComment = customerComment,
      accountId = SessionService.getAccountId(request.session)
    )

    val currentLanguage = SessionService.getCurrentLanguage(request.session)

    OrderDto.createTemporary(tempOrder, currentLanguage) match {
      case None => throw new Exception("OrderDto.createTemporary didn't return an ID!")
      case Some(_) => Created(Json.toJson(OrderDto.getOfIdForFrontend(tempOrderId).get._1))
        .withSession(request.session + (SessionService.SessionKeyOrderId -> tempOrderId.toString))
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
          val cvFileNameOpt = requestBody.file("cvFile") match {
            case None => None
            case Some(cvFile) => Some(documentService.saveFileInDocumentsFolder(cvFile, id, documentService.middleFileNameCv))
          }

          val coverLetterFileNameOpt = requestBody.file("coverLetterFile") match {
            case None => None
            case Some(coverLetterFile) => Some(documentService.saveFileInDocumentsFolder(coverLetterFile, id, documentService.middleFileNameCoverLetter))
          }

          val jobAdFileNameOpt = requestBody.file("jobAdFile") match {
            case None => None
            case Some(jobAdFile) => Some(documentService.saveFileInDocumentsFolder(jobAdFile, id, documentService.middleFileNameJobAd))
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

          val updatedOrder = Order(
            existingOrder.id,
            existingOrder.editionId,
            existingOrder.containedProductCodes,
            existingOrder.couponId,
            cvFileNameOpt,
            coverLetterFileNameOpt,
            existingOrder.linkedinProfileFileName,
            positionSought,
            employerSought,
            jobAdUrl,
            jobAdFileNameOpt,
            existingOrder.linkedinProfileLanguage,
            customerComment,
            existingOrder.accountId,
            existingOrder.status,
            existingOrder.languageCode,
            existingOrder.creationTimestamp,
            existingOrder.paymentTimestamp
          )

          OrderDto.update(updatedOrder)

          Future {
            val orderWithPdfFileNames = orderService.convertDocsToPdf(updatedOrder)
            orderService.generateDocThumbnails(orderWithPdfFileNames)
          } onFailure {
            case e => Logger.error(e.getMessage, e)
          }

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
            val costAfterReductions = order.costAfterReductions()

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

  def removeCoupon() = Action { request =>
    SessionService.getOrderId(request.session) match {
      case None => BadRequest("Couldn't remove the coupon because no order was found in session");
      case Some(id) =>
        OrderDto.getOfId(id) match {
          case None => BadRequest("No order found for ID " + id)
          case Some(existingOrder) =>
            val orderWithoutCoupon = existingOrder.copy(
              couponId = None
            )
            OrderDto.update(orderWithoutCoupon)

            Ok
        }
    }
  }

  private val InterviewDateFormat = new SimpleDateFormat("yyyy-MM-dd")

  def createInterviewTrainingOrder() = Action(parse.multipartFormData) { request =>
    // We only want to generate negative IDs, because positive ones are for non-temp orders
    val rand = Random.nextLong()
    val tempOrderId = if (rand >= 0) {
      -rand
    } else {
      rand
    }


    val requestBody = request.body

    val cvFileNameOpt = requestBody.file("cvFile") match {
      case None => None
      case Some(file) => Some(documentService.saveFileInDocumentsFolder(file, tempOrderId, documentService.middleFileNameCv))
    }

    val jobAdFileNameOpt = requestBody.file("jobAdFile") match {
      case None => None
      case Some(file) => Some(documentService.saveFileInDocumentsFolder(file, tempOrderId, documentService.middleFileNameJobAd))
    }


    val requestData = requestBody.dataParts

    val couponCode = if (!requestData.contains("couponCode")) {
      None
    } else {
      Some(requestData("couponCode").head)
    }

    val jobAdUrl = if (!requestData.contains("jobAdUrl")) {
      None
    } else {
      Some(requestData("jobAdUrl").head)
    }

    // Create temporary order
    val tempOrder = OrderReceivedFromFrontend(
      tempId = tempOrderId,
      containedProductCodes = requestData("containedProductCodes").head.split(",").toList,
      couponCode = couponCode,
      cvFileName = cvFileNameOpt,
      jobAdUrl = jobAdUrl,
      jobAdFileName = jobAdFileNameOpt,
      accountId = SessionService.getAccountId(request.session)
    )

    val currentLanguage = SessionService.getCurrentLanguage(request.session)

    OrderDto.createTemporary(tempOrder, currentLanguage) match {
      case None => throw new Exception("OrderDto.createTemporary didn't return an ID!")
      case Some(_) =>
        val interviewDateOpt = if (!requestData.contains("interviewDate")) {
          None
        } else {
          val interviewDateAsStr = requestData("interviewDate").head
          Some(InterviewDateFormat.parse(interviewDateAsStr))
        }

        val answerToQuestionImportantForTheRoleOpt = if (!requestData.contains("answerToQuestionImportantForTheRole")) {
          None
        } else {
          Some(requestData("answerToQuestionImportantForTheRole").head)
        }

        val answerToQuestionLatestInterviewOpt = if (!requestData.contains("answerToQuestionLatestInterview")) {
          None
        } else {
          Some(requestData("answerToQuestionLatestInterview").head)
        }

        val answerToQuestionNeedForImprovementOpt = if (!requestData.contains("answerToQuestionNeedForImprovement")) {
          None
        } else {
          Some(requestData("answerToQuestionNeedForImprovement").head)
        }

        val answerToQuestionChallengingQuestionsOpt = if (!requestData.contains("answerToQuestionChallengingQuestions")) {
          None
        } else {
          Some(requestData("answerToQuestionChallengingQuestions").head)
        }

        InterviewTrainingOrderInfoDto.create(InterviewTrainingOrderInfo(
          orderId = tempOrderId,
          interviewDate = interviewDateOpt,
          importantForTheRole = answerToQuestionImportantForTheRoleOpt,
          latestInterview = answerToQuestionLatestInterviewOpt,
          needForImprovement = answerToQuestionNeedForImprovementOpt,
          challengingQuestions = answerToQuestionChallengingQuestionsOpt
        ))

        Created(Json.toJson(OrderDto.getOfIdForFrontend(tempOrderId).get._1))
          .withSession(request.session + (SessionService.SessionKeyOrderId -> tempOrderId.toString))
    }
  }

  def updateInterviewTrainingOrder() = Action(parse.multipartFormData) { request =>
    val requestBody = request.body
    val requestData = requestBody.dataParts

    if (!requestData.contains("id")) {
      BadRequest("'id' required")
    } else {
      val id = requestData("id").head.toLong

      OrderDto.getOfId(id) match {
        case None => BadRequest("No order found for ID " + id)

        case Some(existingOrder) =>
          val cvFileNameOpt = requestBody.file("cvFile") match {
            case None => None
            case Some(cvFile) => Some(documentService.saveFileInDocumentsFolder(cvFile, id, documentService.middleFileNameCv))
          }

          val jobAdFileNameOpt = requestBody.file("jobAdFile") match {
            case None => None
            case Some(jobAdFile) => Some(documentService.saveFileInDocumentsFolder(jobAdFile, id, documentService.middleFileNameJobAd))
          }

          val jobAdUrl = if (!requestData.contains("jobAdUrl")) {
            None
          } else {
            Some(requestData("jobAdUrl").head)
          }

          val updatedOrder = Order(
            id = existingOrder.id,
            editionId = existingOrder.editionId,
            containedProductCodes = existingOrder.containedProductCodes,
            couponId = existingOrder.couponId,
            cvFileName = cvFileNameOpt,
            coverLetterFileName = None,
            linkedinProfileFileName = existingOrder.linkedinProfileFileName,
            positionSought = existingOrder.positionSought,
            employerSought = existingOrder.employerSought,
            jobAdUrl = jobAdUrl,
            jobAdFileName = jobAdFileNameOpt,
            customerComment = existingOrder.customerComment,
            accountId = existingOrder.accountId,
            status = existingOrder.status,
            languageCode = existingOrder.languageCode,
            creationTimestamp = existingOrder.creationTimestamp,
            paymentTimestamp = existingOrder.paymentTimestamp
          )

          OrderDto.update(updatedOrder)

          Future {
            val orderWithPdfFileNames = orderService.convertDocsToPdf(updatedOrder)
            orderService.generateDocThumbnails(orderWithPdfFileNames)
          } onFailure {
            case e => Logger.error(e.getMessage, e)
          }

          val interviewDateOpt = if (!requestData.contains("interviewDate")) {
            None
          } else {
            val interviewDateAsStr = requestData("interviewDate").head
            Some(InterviewDateFormat.parse(interviewDateAsStr))
          }

          val answerToQuestionImportantForTheRoleOpt = if (!requestData.contains("answerToQuestionImportantForTheRole")) {
            None
          } else {
            Some(requestData("answerToQuestionImportantForTheRole").head)
          }

          val answerToQuestionLatestInterviewOpt = if (!requestData.contains("answerToQuestionLatestInterview")) {
            None
          } else {
            Some(requestData("answerToQuestionLatestInterview").head)
          }

          val answerToQuestionNeedForImprovementOpt = if (!requestData.contains("answerToQuestionNeedForImprovement")) {
            None
          } else {
            Some(requestData("answerToQuestionNeedForImprovement").head)
          }

          val answerToQuestionChallengingQuestionsOpt = if (!requestData.contains("answerToQuestionChallengingQuestions")) {
            None
          } else {
            Some(requestData("answerToQuestionChallengingQuestions").head)
          }

          val itoi = InterviewTrainingOrderInfoDto.getOfOrderId(id).get

          InterviewTrainingOrderInfoDto.update(itoi.copy(
            interviewDate = interviewDateOpt,
            importantForTheRole = answerToQuestionImportantForTheRoleOpt,
            latestInterview = answerToQuestionLatestInterviewOpt,
            needForImprovement = answerToQuestionNeedForImprovementOpt,
            challengingQuestions = answerToQuestionChallengingQuestionsOpt
          ))

          Ok
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
