package services

import java.io.File

import play.api.Play
import play.api.Play.current
import play.api.mvc.Session

object DocumentService {
  val assessmentDocumentsRootDir = Play.configuration.getString("assessmentDocuments.RootDir").get

  def createAccountRootDir(accountId: Long) {
    val accountRootDir = getRootDirForAccountId(accountId)
    val accountRootDirFile = new File(accountRootDir)
    if (!accountRootDirFile.exists) {
      accountRootDirFile.mkdir() match {
        case false => throw new Exception("Could not create account directory '" + accountRootDir + "'")
        case true =>
      }
    }
  }

  def getRootDirForAccountSession(session: Session): String = {
    getRootDirForAccountId(SessionService.getAccountId(session).get)
  }

  private def getRootDirForAccountId(accountId: Long): String = {
    assessmentDocumentsRootDir + accountId + "\\"
  }
}
