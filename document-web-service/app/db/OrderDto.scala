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
  // TODO: delete when the new App pages are released
  def create(order: OrderReceivedFromClient): Option[Long] = {
    DB.withConnection { implicit c =>
      val nameClause = if (order.positionSought.isDefined && order.employerSought.isDefined) {
        order.positionSought.get + " - " + order.employerSought.get
      } else if (order.positionSought.isDefined) {
        order.positionSought.get
      } else if (order.employerSought.isDefined) {
        order.employerSought.get
      } else {
        "Bedömning"
      }

      val cvFileNameClause = order.cvFileName match {
        case None => ""
        case Some(fileName) => DbUtil.safetize(fileName)
      }

      val coverLetterFileNameClause = order.coverLetterFileName match {
        case None => ""
        case Some(fileName) => DbUtil.safetize(fileName)
      }

      val linkedinPublicProfileUrlClause = order.linkedinPublicProfileUrl match {
        case None => ""
        case Some(url) => DbUtil.safetize(url)
      }

      val couponCodeClause = order.couponCode match {
        case None => ""
        case Some(couponCode) => DbUtil.safetize(couponCode)
      }

      val positionSoughtClause = order.positionSought match {
        case None => ""
        case Some(positionSought) => DbUtil.safetize(positionSought)
      }

      val employerSoughtClause = order.employerSought match {
        case None => ""
        case Some(employerSought) => DbUtil.safetize(employerSought)
      }

      val paidOnClause = if (order.status == Order.statusIdPaid) {
        "'" + DbUtil.formatTimestampForInsertOrUpdate(new Date().getTime) + "'"
      } else {
        "null"
      }

      val query = """
      insert into documents(name, edition_id, file, file_cv, file_li, li_url, added_at, code, added_by, type, status, position, employer, paid_on, session_id, /* useful fields */
        hireability, open_application, score1, score2, score_avg, score1_cv, score2_cv, score_avg_cv, score1_li, score2_li, score_avg_li, transaction_id, response_code, payment_id, payment_client, payment_card_type, payment_card_holder, payment_last4, payment_error, custom_comment, custom_comment_cv, custom_comment_li, how_doing_text, in_progress_at, doc_review, free_test, lang) /* unused but required fields */
      values('""" + nameClause + """', """ +
        order.editionId + """, '""" +
        coverLetterFileNameClause + """', '""" +
        cvFileNameClause + """',
        '', '""" +
        linkedinPublicProfileUrlClause + """',
        now(), '""" +
        couponCodeClause + """', """ +
        order.accountId.getOrElse(AccountDto.unknownUserId) + """, '""" +
        Order.getTypeForDb(order.containedDocTypes) + """', """ +
        order.status + """, '""" +
        positionSoughtClause + """', '""" +
        employerSoughtClause + """', """ +
        paidOnClause + """, '""" +
        order.sessionId + """',
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', 0, '', '', '', '', 0, '', '', '', '', '', 0, 0, 0, 'sw');"""

      Logger.info("OrderDto.create():" + query)

      SQL(query).executeInsert()
    }
  }

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
        where d.id = """ + id + """;"""

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
