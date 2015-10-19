package db

import anorm._
import models.{Price, Reduction}
import play.api.Logger
import play.api.Play.current
import play.api.db.DB

object ReductionDto {
  val all = getAll

  private def getAll: List[Reduction] = {
    DB.withConnection { implicit c =>
      val query = """
        select id, code, reduction_amount
        from reduction
        where reduction_currency_code = 'SEK';"""

      Logger.info("ReductionDto.getAll():" + query)

      SQL(query)().map { row =>
        Reduction(
          id = row[Long]("id"),
          code = row[String]("code"),
          price = Price(
            amount = row[Double]("reduction_amount"),
            currencyCode = "SEK"
          )
        )
      }.toList
    }
  }
}
