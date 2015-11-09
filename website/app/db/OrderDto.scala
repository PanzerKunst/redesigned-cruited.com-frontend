package db

import java.util.Date

import anorm.SqlParser._
import anorm._
import models.Order
import models.frontend.OrderReceivedFromFrontend
import play.api.Logger
import play.api.Play.current
import play.api.db.DB

object OrderDto {
  def createTemporary(order: OrderReceivedFromFrontend): Option[Long] = {
    DB.withConnection { implicit c =>
      val cvFileNameClause = order.cvFileName match {
        case None => ""
        case Some(fileName) => DbUtil.safetize(fileName)
      }

      val coverLetterFileNameClause = order.coverLetterFileName match {
        case None => ""
        case Some(fileName) => DbUtil.safetize(fileName)
      }

      val couponCodeClause = order.couponCode match {
        case None => ""
        case Some(code) => DbUtil.safetize(code)
      }

      val query = """
      insert into documents(id, edition_id, file, file_cv, file_li, added_at, code, added_by, type, /* useful fields */
        paid_on, position, employer, hireability, open_application, li_url, last_rate, score1, score2, score_avg, score1_cv, score2_cv, score_avg_cv, score1_li, score2_li, score_avg_li, transaction_id, response_code, payment_id, payment_client, payment_card_type, payment_card_holder, payment_last4, payment_error, custom_comment, custom_comment_cv, custom_comment_li, how_doing_text, in_progress_at, set_in_progress_at, set_done_at, doc_review, free_test, lang) /* unused but required fields */
      values(""" + order.tempId + """, """ +
        order.editionId + """, '""" +
        coverLetterFileNameClause + """', '""" +
        cvFileNameClause + """',
        '',
        now(), '""" +
        couponCodeClause + """', """ +
        order.accountId.getOrElse(0) + """, '""" +
        Order.getTypeForDb(order.containedProductIds) + """',
        '0000-00-00 00:00:00', '', '', 0, 0, '', '0000-00-00', 0, 0, 0, 0, 0, 0, 0, 0, 0, '', '', '', '', '', '', 0, '', '', '', '', '', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0, 0, 'sw');"""

      Logger.info("OrderDto.createTemporary():" + query)

      SQL(query).executeInsert()
    }
  }

  def create(order: Order): Option[Long] = {
    DB.withConnection { implicit c =>
      val cvFileNameClause = order.cvFileName match {
        case None => ""
        case Some(fileName) => DbUtil.safetize(fileName)
      }

      val coverLetterFileNameClause = order.coverLetterFileName match {
        case None => ""
        case Some(fileName) => DbUtil.safetize(fileName)
      }

      val couponCodeClause = order.couponId match {
        case None => ""
        case Some(couponId) =>
          val coupon = CouponDto.getOfId(couponId).get
          DbUtil.safetize(coupon.code)
      }

      val query = """
      insert into documents(edition_id, file, file_cv, file_li, added_at, code, added_by, type, paid_on, /* useful fields */
        position, employer, hireability, open_application, li_url, last_rate, score1, score2, score_avg, score1_cv, score2_cv, score_avg_cv, score1_li, score2_li, score_avg_li, transaction_id, response_code, payment_id, payment_client, payment_card_type, payment_card_holder, payment_last4, payment_error, custom_comment, custom_comment_cv, custom_comment_li, how_doing_text, in_progress_at, set_in_progress_at, set_done_at, doc_review, free_test, lang) /* unused but required fields */
      values(""" + order.editionId + """, '""" +
        coverLetterFileNameClause + """', '""" +
        cvFileNameClause + """',
        '', '""" +
        DbUtil.formatTimestampForInsertOrUpdate(order.creationTimestamp) + """', '""" +
        couponCodeClause + """', """ +
        order.accountId.getOrElse(0) + """, '""" +
        Order.getTypeForDb(order.containedProductIds) + """',
        now(),
        '', '', 0, 0, '', '0000-00-00', 0, 0, 0, 0, 0, 0, 0, 0, 0, '', '', '', '', '', '', 0, '', '', '', '', '', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0, 0, 'sw');"""

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
        case Some(fileName) => ", file_cv = '" + DbUtil.safetize(fileName) + "'"
      }

      val coverLetterFileNameClause = order.coverLetterFileName match {
        case None => ""
        case Some(fileName) => ", file = '" + DbUtil.safetize(fileName) + "'"
      }

      val query = """
        update documents set
        edition_id = """ + order.editionId +
        accountIdClause +
        cvFileNameClause +
        coverLetterFileNameClause + """
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
        select edition_id, file, file_cv, added_at, code, added_by, type
        from documents
        where id = """ + id + """;"""

      Logger.info("OrderDto.getOfId():" + query)

      val optionRowParser = long("edition_id") ~ str("file") ~ str("file_cv") ~ date("added_at") ~ str("code") ~ long("added_by") ~ str("type") map {
        case editionId ~ coverLetterFileName ~ cvFileName ~ creationDate ~ couponCode ~ accountId ~ docTypes =>

          val coverLetterFileNameOpt = coverLetterFileName match {
            case "" => None
            case otherString => Some(otherString)
          }

          val cvFileNameOpt = cvFileName match {
            case "" => None
            case otherString => Some(otherString)
          }

          val couponIdOpt = couponCode match {
            case "" => None
            case otherString => Some(CouponDto.getOfCode(otherString).get.id)
          }

          val accountIdOpt = accountId match {
            case 0 => None
            case otherNb => Some(otherNb)
          }

          Order(
            id = Some(id),
            editionId = editionId,
            containedProductIds = Order.getContainedProductIdsFromTypes(docTypes),
            couponId = couponIdOpt,
            cvFileName = cvFileNameOpt,
            coverLetterFileName = coverLetterFileNameOpt,
            accountId = accountIdOpt,
            creationTimestamp = creationDate.getTime
          )
      }

      SQL(query).as(optionRowParser.singleOpt)
    }
  }

  def getTemporaryOrdersForAccountId(accountId: Long): List[Order] = {
    DB.withConnection { implicit c =>
      val query = """
        select id, edition_id, file, file_cv, added_at, code, added_by, type
        from documents
        where added_by = """ + accountId + """
          and id < 0
        order by id;"""

      Logger.info("OrderDto.getTemporaryOrdersForAccountId():" + query)

      SQL(query)().map { row =>
        val coverLetterFileNameOpt = row[String]("file") match {
          case "" => None
          case otherString => Some(otherString)
        }

        val cvFileNameOpt = row[String]("file_cv") match {
          case "" => None
          case otherString => Some(otherString)
        }

        val couponIdOpt = row[String]("code") match {
          case "" => None
          case otherString => Some(CouponDto.getOfCode(otherString).get.id)
        }

        val accountIdOpt = row[Long]("added_by") match {
          case 0 => None
          case otherNb => Some(otherNb)
        }


        Order(
          id = Some(row[Long]("id")),
          editionId = row[Long]("edition_id"),
          containedProductIds = Order.getContainedProductIdsFromTypes(row[String]("type")),
          couponId = couponIdOpt,
          cvFileName = cvFileNameOpt,
          coverLetterFileName = coverLetterFileNameOpt,
          accountId = accountIdOpt,
          creationTimestamp = row[Date]("added_at").getTime
        )
      }.toList
    }
  }
}
