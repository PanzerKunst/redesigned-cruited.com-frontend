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

  def renameAccountDir(oldAccountId: Long, newAccountId: Long) {
    val oldAccountRootDir = getRootDirForAccountId(oldAccountId)
    val oldAccountRootDirFile = new File(oldAccountRootDir)
    if (!oldAccountRootDirFile.exists) {
      throw new Exception("Try to rename account dir for " + oldAccountId + " to " + newAccountId + " but the old one doesn't exist!")
    }

    val newAccountRootDir = getRootDirForAccountId(newAccountId)
    val newAccountRootDirFile = new File(newAccountRootDir)
    if (newAccountRootDirFile.exists) {
      throw new Exception("Impossible to rename account dir to new ID " + newAccountId + " because such a directory already exists!")
    }

    oldAccountRootDirFile.renameTo(newAccountRootDirFile)
  }

  def getRootDirForAccountSession(session: Session): String = {
    getRootDirForAccountId(SessionService.getAccountId(session).get)
  }

  private def getRootDirForAccountId(accountId: Long): String = {
    assessmentDocumentsRootDir + accountId + "\\"
  }
}