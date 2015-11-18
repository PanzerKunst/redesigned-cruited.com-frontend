package db

import java.util.Date

import anorm.SqlParser._
import anorm._
import models.frontend.{FrontendOrder, OrderReceivedFromFrontend}
import models.{Edition, Order}
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

      val positionSoughtClause = order.positionSought match {
        case None => ""
        case Some(positionSought) => DbUtil.safetize(positionSought)
      }

      val employerSoughtClause = order.employerSought match {
        case None => ""
        case Some(employerSought) => DbUtil.safetize(employerSought)
      }

      val jobAdUrlClause = order.jobAdUrl match {
        case None => "NULL"
        case Some(jobAdUrl) => "'" + DbUtil.safetize(jobAdUrl) + "'"
      }

      val query = """
      insert into documents(id, edition_id, file, file_cv, file_li, added_at, code, added_by, type, status, position, employer, job_ad_url, /* useful fields */
        paid_on, hireability, open_application, li_url, last_rate, score1, score2, score_avg, score1_cv, score2_cv, score_avg_cv, score1_li, score2_li, score_avg_li, transaction_id, response_code, payment_id, payment_client, payment_card_type, payment_card_holder, payment_last4, payment_error, custom_comment, custom_comment_cv, custom_comment_li, how_doing_text, in_progress_at, set_in_progress_at, set_done_at, doc_review, free_test, lang) /* unused but required fields */
      values(""" + order.tempId + """, """ +
        order.editionId + """, '""" +
        coverLetterFileNameClause + """', '""" +
        cvFileNameClause + """',
        '',
        now(), '""" +
        couponCodeClause + """', """ +
        order.accountId.getOrElse(0) + """, '""" +
        Order.getTypeForDb(order.containedProductCodes) + """', """ +
        Order.statusIdNotPaid + """, '""" +
        positionSoughtClause + """', '""" +
        employerSoughtClause + """', """ +
        jobAdUrlClause + """,
        '0000-00-00 00:00:00', 0, 0, '', '0000-00-00', 0, 0, 0, 0, 0, 0, 0, 0, 0, '', '', '', '', '', '', 0, '', '', '', '', '', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0, 0, 'sw');"""

      Logger.info("OrderDto.createTemporary():" + query)

      SQL(query).executeInsert()
    }
  }

  def createFinalised(order: Order): Option[Long] = {
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

      val positionSoughtClause = order.positionSought match {
        case None => ""
        case Some(positionSought) => DbUtil.safetize(positionSought)
      }

      val employerSoughtClause = order.employerSought match {
        case None => ""
        case Some(employerSought) => DbUtil.safetize(employerSought)
      }

      val jobAdUrlClause = order.jobAdUrl match {
        case None => "NULL"
        case Some(jobAdUrl) => "'" + DbUtil.safetize(jobAdUrl) + "'"
      }

      val query = """
      insert into documents(edition_id, file, file_cv, file_li, added_at, code, added_by, type, status, position, employer, job_ad_url, paid_on, /* useful fields */
        hireability, open_application, li_url, last_rate, score1, score2, score_avg, score1_cv, score2_cv, score_avg_cv, score1_li, score2_li, score_avg_li, transaction_id, response_code, payment_id, payment_client, payment_card_type, payment_card_holder, payment_last4, payment_error, custom_comment, custom_comment_cv, custom_comment_li, how_doing_text, in_progress_at, set_in_progress_at, set_done_at, doc_review, free_test, lang) /* unused but required fields */
      values(""" + order.editionId + """, '""" +
        coverLetterFileNameClause + """', '""" +
        cvFileNameClause + """',
        '', '""" +
        DbUtil.formatTimestampForInsertOrUpdate(order.creationTimestamp) + """', '""" +
        couponCodeClause + """', """ +
        order.accountId.getOrElse(0) + """, '""" +
        Order.getTypeForDb(order.containedProductCodes) + """', """ +
        Order.statusIdPaid + """, '""" +
        positionSoughtClause + """', '""" +
        employerSoughtClause + """', """ +
        jobAdUrlClause + """,
        now(),
        0, 0, '', '0000-00-00', 0, 0, 0, 0, 0, 0, 0, 0, 0, '', '', '', '', '', '', 0, '', '', '', '', '', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0, 0, 'sw');"""

      Logger.info("OrderDto.createFinalised():" + query)

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
        select edition_id, file, file_cv, file_li, added_at, code, added_by, type, status, position, employer, job_ad_url
        from documents
        where id = """ + id + """;"""

      Logger.info("OrderDto.getOfId():" + query)

      val optionRowParser = long("edition_id") ~ str("file") ~ str("file_cv") ~ str("file_li") ~ date("added_at") ~ str("code") ~ long("added_by") ~ str("type") ~ int("status") ~ str("position") ~ str("employer") ~ (str("job_ad_url") ?) map {
        case editionId ~ coverLetterFileName ~ cvFileName ~ linkedinProfileFileName ~ creationDate ~ couponCode ~ accountId ~ docTypes ~ status ~ positionSought ~ employerSought ~ jobAdUrl =>

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

          val couponIdOpt = couponCode match {
            case "" => None
            case otherString => Some(CouponDto.getOfCode(otherString).get.id)
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
            couponId = couponIdOpt,
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

  def getOfAccountId(accountId: Long): List[Order] = {
    DB.withConnection { implicit c =>
      val query = """
        select id, edition_id, file, file_cv, file_li, added_at, code, added_by, type, status, position, employer, job_ad_url
        from documents
        where added_by = """ + accountId + """
        order by id desc;"""

      Logger.info("OrderDto.getOfAccountId():" + query)

      SQL(query)().map { row =>
        val coverLetterFileNameOpt = row[String]("file") match {
          case "" => None
          case otherString => Some(otherString)
        }

        val cvFileNameOpt = row[String]("file_cv") match {
          case "" => None
          case otherString => Some(otherString)
        }

        val linkedinProfileFileNameOpt = row[String]("file_li") match {
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

        val positionSoughtOpt = row[String]("position") match {
          case "" => None
          case otherString => Some(otherString)
        }

        val employerSoughtOpt = row[String]("employer") match {
          case "" => None
          case otherString => Some(otherString)
        }


        Order(
          id = Some(row[Long]("id")),
          editionId = row[Long]("edition_id"),
          containedProductCodes = Order.getContainedProductCodesFromTypes(row[String]("type")),
          couponId = couponIdOpt,
          cvFileName = cvFileNameOpt,
          coverLetterFileName = coverLetterFileNameOpt,
          linkedinProfileFileName = linkedinProfileFileNameOpt,
          positionSought = positionSoughtOpt,
          employerSought = employerSoughtOpt,
          jobAdUrl = row[Option[String]]("job_ad_url"),
          accountId = accountIdOpt,
          status = row[Int]("status"),
          creationTimestamp = row[Date]("added_at").getTime
        )
      }.toList
    }
  }

  def getOfAccountIdForFrontend(accountId: Long): List[FrontendOrder] = {
    DB.withConnection { implicit c =>
      val query = """
        select d.id as order_id, file, file_cv, file_li, added_at, added_by, type, d.status, position, employer, job_ad_url,
          e.id as edition_id, edition,
          c.id as coupon_id
        from documents d
        inner join product_edition e on e.id = d.edition_id
        left join codes c on c.name = d.code
        where added_by = """ + accountId + """
        order by d.id desc;"""

      Logger.info("OrderDto.getOfAccountIdForFrontend():" + query)

      SQL(query)().map { row =>
        val coverLetterFileNameOpt = row[String]("file") match {
          case "" => None
          case otherString => Some(otherString)
        }

        val cvFileNameOpt = row[String]("file_cv") match {
          case "" => None
          case otherString => Some(otherString)
        }

        val linkedinProfileFileNameOpt = row[String]("file_li") match {
          case "" => None
          case otherString => Some(otherString)
        }

        val accountId = row[Long]("added_by") match {
          case 0 => throw new Exception("OrderDto.getOfAccountIdForFrontend > added_by is zero, this should never happen!")
          case otherNb => otherNb
        }

        val positionSoughtOpt = row[String]("position") match {
          case "" => None
          case otherString => Some(otherString)
        }

        val employerSoughtOpt = row[String]("employer") match {
          case "" => None
          case otherString => Some(otherString)
        }


        FrontendOrder(
          id = row[Long]("order_id"),
          edition = Edition(
            id = row[Long]("edition_id"),
            code = row[String]("edition")
          ),
          containedProductCodes = Order.getContainedProductCodesFromTypes(row[String]("type")),
          couponId = row[Option[Long]]("coupon_id"),
          cvFileName = cvFileNameOpt,
          coverLetterFileName = coverLetterFileNameOpt,
          linkedinProfileFileName = linkedinProfileFileNameOpt,
          positionSought = positionSoughtOpt,
          employerSought = employerSoughtOpt,
          jobAdUrl = row[Option[String]]("job_ad_url"),
          accountId = accountId,
          status = row[Int]("status"),
          creationTimestamp = row[Date]("added_at").getTime
        )
      }.toList
    }
  }
}
