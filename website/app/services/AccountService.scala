package services

import db.AccountDto
import play.api.mvc.Session

import scala.util.Random

object AccountService {
  var resetPasswordTokens: Map[String, Long] = Map()  // [token, accountID]

  def generateTempAccountIdAndStoreAccount(session: Session): Long = {
    // We only want to generate negative IDs, because positive ones are for non-temp accounts
    val rand = Random.nextLong()
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
