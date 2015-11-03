package services

import db.AccountDto
import models.Account
import play.api.libs.json.{JsNull, JsValue, Json}
import play.api.mvc.Session

import scala.util.Random

object AccountService {
  def generateTempAccountIdAndInitialiseTables(session: Session): Long = {
    val rand = Random.nextLong()

    // We only want to generate negative IDs, because positive ones are for non-temp accounts
    val tempAccoundId = if (rand >= 0) {
      -rand
    } else {
      rand
    }

    AccountDto.createTemporary(tempAccoundId) match {
      case None => throw new Exception("AccountDto.createTemporary() didn't return an ID")
      case Some(accountId) => accountId
    }
  }

  def isTemporary(accountId: Long): Boolean = {
    accountId < 0
  }
}
