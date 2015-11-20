package models

import db.CruitedProductDto
import play.api.libs.functional.syntax._
import play.api.libs.json.{JsPath, Writes}

case class CruitedProduct(id: Long,
                          code: String,
                          price: Price) {

  def getTypeForDb: String = {
    code match {
      case CruitedProduct.codeCvReview => CruitedProduct.dbTypeCvReview
      case CruitedProduct.codeCoverLetterReview => CruitedProduct.dbTypeCoverLetterReview
      case CruitedProduct.codeLinkedinProfileReview => CruitedProduct.dbTypeLinkedinProfileReview
    }
  }
}

object CruitedProduct {
  implicit val writes: Writes[CruitedProduct] = (
    (JsPath \ "id").write[Long] and
      (JsPath \ "code").write[String] and
      (JsPath \ "price").write[Price]
    )(unlift(CruitedProduct.unapply))

  val codeCvReview = "CV_REVIEW"
  val codeCoverLetterReview = "COVER_LETTER_REVIEW"
  val codeLinkedinProfileReview = "LINKEDIN_PROFILE_REVIEW"

  val dbTypeCvReview = "cv"
  val dbTypeCoverLetterReview = "letter"
  val dbTypeLinkedinProfileReview = "li"

  def getCodeFromType(typeForDb: String): String = {
    typeForDb match {
      case `dbTypeCvReview` => codeCvReview
      case `dbTypeCoverLetterReview` => codeCoverLetterReview
      case `dbTypeLinkedinProfileReview` => codeLinkedinProfileReview
    }
  }
}
