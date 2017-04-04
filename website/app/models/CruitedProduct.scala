package models

import play.api.libs.functional.syntax._
import play.api.libs.json.{JsPath, Writes}

case class CruitedProduct(id: Long,
                          code: String,
                          price: Price) {

  def getTypeForDb: String = {
    code match {
      case CruitedProduct.CodeCvReview => CruitedProduct.DbTypeCvReview
      case CruitedProduct.CodeCoverLetterReview => CruitedProduct.DbTypeCoverLetterReview
      case CruitedProduct.CodeLinkedinProfileReview => CruitedProduct.DbTypeLinkedinProfileReview
      case CruitedProduct.CodeCvReviewForConsultant => CruitedProduct.DbTypeCvReview
      case CruitedProduct.CodeLinkedinProfileReviewForConsultant => CruitedProduct.DbTypeLinkedinProfileReview
      case CruitedProduct.CodeInterviewTraining => CruitedProduct.DbTypeInterviewTraining
    }
  }
}

object CruitedProduct {
  implicit val writes: Writes[CruitedProduct] = (
    (JsPath \ "id").write[Long] and
      (JsPath \ "code").write[String] and
      (JsPath \ "price").write[Price]
    ) (unlift(CruitedProduct.unapply))

  val CodeCvReview = "CV_REVIEW"
  val CodeCoverLetterReview = "COVER_LETTER_REVIEW"
  val CodeLinkedinProfileReview = "LINKEDIN_PROFILE_REVIEW"
  val CodeCvReviewForConsultant = "CV_REVIEW_CONSULT"
  val CodeLinkedinProfileReviewForConsultant = "LINKEDIN_PROFILE_REVIEW_CONSULT"
  val CodeInterviewTraining = "INTERVIEW_TRAINING"

  val DbTypeCvReview = "cv"
  val DbTypeCoverLetterReview = "letter"
  val DbTypeLinkedinProfileReview = "li"
  val DbTypeInterviewTraining = "it"

  def getCodeFromType(typeForDb: String): String = {
    typeForDb match {
      case DbTypeCvReview => CodeCvReview
      case DbTypeCoverLetterReview => CodeCoverLetterReview
      case DbTypeLinkedinProfileReview => CodeLinkedinProfileReview
      case DbTypeInterviewTraining => CodeInterviewTraining
    }
  }
}
