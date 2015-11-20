package db

import anorm.SqlParser._
import anorm._
import models.Order
import play.api.Logger
import play.api.Play.current
import play.api.db.DB

object OrderDto {
  def update(order: Order) {
    DB.withConnection { implicit c =>
      val accountIdClause = order.accountId match {
        case None => ""
        case Some(accountId) => ", added_by = " + accountId
      }

      val cvFileNameClause = order.cvFileName match {
        case None => ""
        case Some(fileName) => ", file_cv = '" + DbUtil.safetize(fileName) + "'"
      }

      val coverLetterFileNameClause = order.coverLetterFileName match {
        case None => ""
        case Some(fileName) => ", file = '" + DbUtil.safetize(fileName) + "'"
      }

      val linkedinProfileFileNameClause = order.linkedinProfileFileName match {
        case None => ""
        case Some(fileName) => ", file_li = '" + DbUtil.safetize(fileName) + "'"
      }

      val query = """
        update documents set
        edition_id = """ + order.editionId + """,
        status = """ + order.status +
        accountIdClause +
        cvFileNameClause +
        coverLetterFileNameClause +
        linkedinProfileFileNameClause + """
        where id = """ + order.id.get + """;"""

      Logger.info("OrderDto.update():" + query)

      SQL(query).executeUpdate()
    }
  }

  def deleteOfId(id: Long) {
    DB.withConnection { implicit c =>
      val query = """
        delete from documents
        where id = """ + id + """;"""

      Logger.info("OrderDto.deleteOfId():" + query)

      SQL(query).execute()
    }
  }

  def getOfId(id: Long): Option[Order] = {
    DB.withConnection { implicit c =>
      val query = """
        select edition_id, file, file_cv, file_li, added_at, added_by, type, status, position, employer, job_ad_url,
          c.id as coupon_id
        from documents d
        left join codes c on c.name = d.code
        where d.id = """ + id + """;"""

      Logger.info("OrderDto.getOfId():" + query)

      val optionRowParser = long("edition_id") ~ str("file") ~ str("file_cv") ~ str("file_li") ~ date("added_at") ~ long("added_by") ~ str("type") ~ int("status") ~ str("position") ~ str("employer") ~ (str("job_ad_url") ?) ~ (long("coupon_id") ?) map {
        case editionId ~ coverLetterFileName ~ cvFileName ~ linkedinProfileFileName ~ creationDate ~ accountId ~ docTypes ~ status ~ positionSought ~ employerSought ~ jobAdUrl ~ couponId =>

          val coverLetterFileNameOpt = coverLetterFileName match {
            case "" => None
            case otherString => Some(otherString)
          }

          val cvFileNameOpt = cvFileName match {
            case "" => None
            case otherString => Some(otherString)
          }

          val linkedinProfileFileNameOpt = linkedinProfileFileName match {
            case "" => None
            case otherString => Some(otherString)
          }

          val accountIdOpt = accountId match {
            case 0 => None
            case otherNb => Some(otherNb)
          }

          val positionSoughtOpt = positionSought match {
            case "" => None
            case otherString => Some(otherString)
          }

          val employerSoughtOpt = employerSought match {
            case "" => None
            case otherString => Some(otherString)
          }

          Order(
            id = Some(id),
            editionId = editionId,
            containedProductCodes = Order.getContainedProductCodesFromTypes(docTypes),
            couponId = couponId,
            cvFileName = cvFileNameOpt,
            coverLetterFileName = coverLetterFileNameOpt,
            linkedinProfileFileName = linkedinProfileFileNameOpt,
            positionSought = positionSoughtOpt,
            employerSought = employerSoughtOpt,
            jobAdUrl = jobAdUrl,
            accountId = accountIdOpt,
            status = status,
            creationTimestamp = creationDate.getTime
          )
      }

      SQL(query).as(optionRowParser.singleOpt)
    }
  }
}
