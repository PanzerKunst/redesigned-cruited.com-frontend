package services

import db.{OrderDto, SupportedLanguageDto, AccountDto}
import play.api.libs.json.{JsNull, JsValue}
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

  def finaliseAccount(emailAddress: String, firstName: String, password: Option[String], linkedinProfile: JsValue, session: Session): Long = {
    val currentLanguageCode = SessionService.getCurrentLanguage(session).ietfCode
    val currentLanguage = SupportedLanguageDto.getOfCode(currentLanguageCode).get

    val finalisedAccountId = AccountDto.create(emailAddress, firstName, password, linkedinProfile, currentLanguage).get

    SessionService.getAccountId(session) match {
      case None =>
      case Some(oldAccountId) =>
        val oldAccount = AccountDto.getOfId(oldAccountId).get

        // 1. If the old one has linkedIn info that the new one doesn't, we set it
        if (oldAccount.linkedinProfile != JsNull) {
          val finalisedAccount = AccountDto.getOfId(finalisedAccountId).get

          if (finalisedAccount.linkedinProfile == JsNull) {
            val updatedAccount = finalisedAccount.copy(
              linkedinProfile = oldAccount.linkedinProfile
            )
            AccountDto.update(updatedAccount)
          }
        }

        // We move the eventual orders to the new account
        moveOrdersFromOldToNewAccount(oldAccountId, finalisedAccountId)

        // 2. We delete the old account
        AccountDto.deleteOfId(oldAccountId)
    }

    finalisedAccountId
  }

  private def moveOrdersFromOldToNewAccount(oldAccountId: Long, newAccountId: Long) {
    for (order <- OrderDto.getOfAccountId(oldAccountId)) {
      val updatedOrder = order.copy(
        accountId = Some(newAccountId)
      )
      OrderDto.update(updatedOrder)
    }
  }
}
