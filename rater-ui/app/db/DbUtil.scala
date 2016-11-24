package db

import java.sql.Timestamp
import java.text.SimpleDateFormat

object DbUtil {
  val dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")

  def safetize(string: String): String = {
    string.replaceAll("'", "''")
      .replaceAll("\\n", "\\\\n")
  }

  def parseToList[T](string: String): List[T] = {
    val arrayOfString = string.split(',')

    arrayOfString.map { item =>
      item.asInstanceOf[T]
    }.toList
  }

  def formatTimestampForInsertOrUpdate(timestamp: Long): String = {
    new Timestamp(timestamp).toString
  }
}
