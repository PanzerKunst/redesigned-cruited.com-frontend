package models

import db.CruitedProductDto
import play.api.libs.functional.syntax._
import play.api.libs.json.{JsPath, Writes}

case class CruitedProduct(id: Long,
                          code: String,
                          price: Price) {

  def getTypeForDb: String = {
    code match {
      case CruitedProduct.CODE_CV_REVIEW => CruitedProduct.DB_TYPE_CV_REVIEW
      case CruitedProduct.CODE_COVER_LETTER_REVIEW => CruitedProduct.DB_TYPE_COVER_LETTER_REVIEW
      case CruitedProduct.CODE_LINKEDIN_PROFILE_REVIEW => CruitedProduct.DB_TYPE_LINKEDIN_PROFILE_REVIEW
    }
  }
}

object CruitedProduct {
  implicit val writes: Writes[CruitedProduct] = (
    (JsPath \ "id").write[Long] and
      (JsPath \ "code").write[String] and
      (JsPath \ "price").write[Price]
    )(unlift(CruitedProduct.unapply))

  val CODE_CV_REVIEW = "CV_REVIEW"
  val CODE_COVER_LETTER_REVIEW = "COVER_LETTER_REVIEW"
  val CODE_LINKEDIN_PROFILE_REVIEW = "LINKEDIN_PROFILE_REVIEW"

  val DB_TYPE_CV_REVIEW = "cv"
  val DB_TYPE_COVER_LETTER_REVIEW = "letter"
  val DB_TYPE_LINKEDIN_PROFILE_REVIEW = "li"

  def getFromType(typeForDb: String): CruitedProduct = {
    val allProducts = CruitedProductDto.getAll

    typeForDb match {
      case DB_TYPE_CV_REVIEW => allProducts.filter(p => p.code == CODE_CV_REVIEW).head
      case DB_TYPE_COVER_LETTER_REVIEW => allProducts.filter(p => p.code == CODE_COVER_LETTER_REVIEW).head
      case DB_TYPE_LINKEDIN_PROFILE_REVIEW => allProducts.filter(p => p.code == CODE_LINKEDIN_PROFILE_REVIEW).head
    }
  }
}
