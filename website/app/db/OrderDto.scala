package db

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
      insert into documents(id, edition_id, file, file_cv, file_li, added_at, code, added_by, /* useful fields */
        paid_on, type, position, employer, hireability, open_application, li_url, last_rate, score1, score2, score_avg, score1_cv, score2_cv, score_avg_cv, score1_li, score2_li, score_avg_li, transaction_id, response_code, payment_id, payment_client, payment_card_type, payment_card_holder, payment_last4, payment_error, custom_comment, custom_comment_cv, custom_comment_li, how_doing_text, in_progress_at, set_in_progress_at, set_done_at, doc_review, free_test, lang) /* unused but required fields */
      values(""" + order.tempId + """, """ +
        order.editionId + """, '""" +
        coverLetterFileNameClause + """', '""" +
        cvFileNameClause + """',
        '',
        now(), '""" +
        couponCodeClause + """', """ +
        order.accountId.getOrElse(0) + """,
        '0000-00-00 00:00:00', '""" + Order.getTypeForDb(order.containedProductIds) + """', '', '', 0, 0, '', '0000-00-00', 0, 0, 0, 0, 0, 0, 0, 0, 0, '', '', '', '', '', '', 0, '', '', '', '', '', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0, 0, 'sw');"""

      Logger.info("OrderDto.createTemporary():" + query)

      SQL(query).executeInsert()
    }
  }
}
