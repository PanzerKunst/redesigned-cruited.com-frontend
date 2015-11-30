package db

import anorm.SqlParser._
import anorm._
import models.{Price, Reduction}
import play.api.Logger
import play.api.Play.current
import play.api.db.DB

object ReductionDto {
  def getAll: List[Reduction] = {
    DB.withConnection { implicit c =>
      val query = """
        select id, code, reduction_amount
        from reduction
        where reduction_currency_code = 'SEK'
        order by id;"""

      Logger.info("ReductionDto.getAll():" + query)

      val rowParser = long("id") ~ str("code") ~ double("reduction_amount") map {
        case id ~ code ~ reductionAmount =>

          Reduction(
            id = id,
            code = code,
            price = Price(
              amount = reductionAmount,
              currencyCode = "SEK"
            )
          )
      }

      SQL(query).as(rowParser.*)
    }
  }
}
