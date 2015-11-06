package models

import play.api.libs.functional.syntax._
import play.api.libs.json.{JsPath, Writes}

case class CruitedProduct(id: Long,
                          code: String,
                          price: Price) {

  def getTypeForDb: String = {
    code match {
      case CruitedProduct.CODE_CV_REVIEW => "cv"
      case CruitedProduct.CODE_COVER_LETTER_REVIEW => "letter"
      case CruitedProduct.CODE_LINKEDIN_PROFILE_REVIEW => "li"
    }
  }
}

object CruitedProduct {
  val CODE_CV_REVIEW = "CV_REVIEW"
  val CODE_COVER_LETTER_REVIEW = "COVER_LETTER_REVIEW"
  val CODE_LINKEDIN_PROFILE_REVIEW = "LINKEDIN_PROFILE_REVIEW"

  implicit val writes: Writes[CruitedProduct] = (
    (JsPath \ "id").write[Long] and
      (JsPath \ "code").write[String] and
      (JsPath \ "price").write[Price]
    )(unlift(CruitedProduct.unapply))
}
