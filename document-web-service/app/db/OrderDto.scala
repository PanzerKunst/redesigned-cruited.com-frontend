package db

import java.util.Date

import anorm.SqlParser._
import anorm._
import models.Order
import models.client.OrderReceivedFromClient
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
        case Some(fileName) => ", file_cv = '" + order.id.get + Order.fileNamePrefixSeparator + DbUtil.safetize(fileName) + "'"
      }

      val coverLetterFileNameClause = order.coverLetterFileName match {
        case None => ""
        case Some(fileName) => ", file = '" + order.id.get + Order.fileNamePrefixSeparator + DbUtil.safetize(fileName) + "'"
      }

      val linkedinProfileFileNameClause = order.linkedinProfileFileName match {
        case None => ""
        case Some(fileName) => ", file_li = '" + order.id.get + Order.fileNamePrefixSeparator + DbUtil.safetize(fileName) + "'"
      }

      val positionSoughtClause = order.positionSought match {
        case None => ""
        case Some(positionSought) => ", position = '" + DbUtil.safetize(positionSought) + "'"
      }

      val employerSoughtClause = order.employerSought match {
        case None => ""
        case Some(employerSought) => ", employer = '" + DbUtil.safetize(employerSought) + "'"
      }

      val jobAdUrlClause = order.jobAdUrl match {
        case None => ""
        case Some(jobAdUrl) => ", job_ad_url = '" + DbUtil.safetize(jobAdUrl) + "'"
      }

      val customerCommentClause = order.customerComment match {
        case None => ""
        case Some(customerComment) => ", customer_comment = '" + DbUtil.safetize(customerComment) + "'"
      }

      val query = """
        update documents set
        edition_id = """ + order.editionId + """,
        status = """ + order.status +
        accountIdClause +
        cvFileNameClause +
        coverLetterFileNameClause +
        linkedinProfileFileNameClause +
        positionSoughtClause +
        employerSoughtClause +
        jobAdUrlClause +
        customerCommentClause + """
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
        select file, file_cv, file_li, added_at, added_by, type, d.status, position, employer, job_ad_url, customer_comment,
          e.id as edition_id, edition,
          c.id as coupon_id, c.name, discount, discount_type, valid_date, campaign_name
        from documents d
          inner join product_edition e on e.id = d.edition_id
          left join codes c on c.name = d.code
        where d.id = """ + id + """
          and d.shw = 1;"""

      Logger.info("OrderDto.getOfId():" + query)

      val rowParser = str("file") ~ str("file_cv") ~ str("file_li") ~ date("added_at") ~ long("added_by") ~ str("type") ~ int("status") ~ str("position") ~ str("employer") ~ (str("job_ad_url") ?) ~ (str("customer_comment") ?) ~
        long("edition_id") ~ str("edition") ~
        (long("coupon_id") ?) ~ (str("name") ?) ~ (int("discount") ?) ~ (str("discount_type") ?) ~ (date("valid_date") ?) ~ (str("campaign_name") ?) map {
        case coverLetterFileName ~ cvFileName ~ linkedinProfileFileName ~ creationDate ~ accountId ~ docTypes ~ status ~ positionSought ~ employerSought ~ jobAdUrlOpt ~ customerCommentOpt ~
          editionId ~ editionCode ~
          couponIdOpt ~ couponCodeOpt ~ amountOpt ~ discountTypeOpt ~ expirationDateOpt ~ campaignNameOpt =>

          val coverLetterFileNameOpt = coverLetterFileName match {
            case "" => None
            case otherString => Order.getFileNameWithoutPrefix(Some(otherString))
          }

          val cvFileNameOpt = cvFileName match {
            case "" => None
            case otherString => Order.getFileNameWithoutPrefix(Some(otherString))
          }

          val linkedinProfileFileNameOpt = linkedinProfileFileName match {
            case "" => None
            case otherString => Order.getFileNameWithoutPrefix(Some(otherString))
          }

          val accountIdOpt = accountId match {
            case AccountDto.unknownUserId => None
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
            containedProductCodes = Order.getContainedProductCodesFromTypesString(docTypes),
            couponId = couponIdOpt,
            cvFileName = cvFileNameOpt,
            coverLetterFileName = coverLetterFileNameOpt,
            linkedinProfileFileName = linkedinProfileFileNameOpt,
            positionSought = positionSoughtOpt,
            employerSought = employerSoughtOpt,
            jobAdUrl = jobAdUrlOpt,
            customerComment = customerCommentOpt,
            accountId = accountIdOpt,
            status = status,
            creationTimestamp = Some(creationDate.getTime)
          )
      }

      SQL(query).as(rowParser.singleOpt)
    }
  }
}
