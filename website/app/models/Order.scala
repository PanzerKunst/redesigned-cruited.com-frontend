package models

import db.CruitedProductDto
import play.api.libs.functional.syntax._
import play.api.libs.json.{JsPath, Writes}

case class Order(id: Option[Long],
                 editionId: Long,
                 containedProductIds: List[Long],
                 couponId: Option[Long],
                 cvFileName: Option[String],
                 coverLetterFileName: Option[String],
                 accountId: Option[Long],
                 creationTimestamp: Long)

object Order {
  implicit val writes: Writes[Order] = (
    (JsPath \ "id").writeNullable[Long] and
      (JsPath \ "editionId").write[Long] and
      (JsPath \ "containedProductIds").write[List[Long]] and
      (JsPath \ "couponId").writeNullable[Long] and
      (JsPath \ "cvFileName").writeNullable[String] and
      (JsPath \ "coverLetterFileName").writeNullable[String] and
      (JsPath \ "accountId").writeNullable[Long] and
      (JsPath \ "creationTimestamp").write[Long]
    )(unlift(Order.unapply))

  val typeStringSeparator = ","

  def getTypeForDb(containedProductIds: List[Long]): String = {
    containedProductIds.length match {
      case 0 => ""
      case nbAboveZero =>
        val allProducts = CruitedProductDto.getAll
        nbAboveZero match {
          case 1 =>
            allProducts.filter(p => p.id == containedProductIds.head).head
              .getTypeForDb
          case nbAboveOne =>
            // First item handled differently - no comma prefix
            val firstProduct = allProducts.filter(p => p.id == containedProductIds.head).head

            var result = firstProduct.getTypeForDb

            for (i <- 1 to nbAboveOne - 1) {
              val product = allProducts.filter(p => p.id == containedProductIds(i)).head
              result = result + typeStringSeparator + product.getTypeForDb
            }

            result
        }
    }
  }

  def getContainedProductIdsFromTypes(docTypes: String): List[Long] = {
    docTypes.split(typeStringSeparator)
      .map(typeForDb => CruitedProduct.getFromType(typeForDb).id)
      .toList
  }
}
