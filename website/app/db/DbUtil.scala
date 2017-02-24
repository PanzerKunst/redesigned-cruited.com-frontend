package db

import java.sql.Timestamp
import java.text.SimpleDateFormat

object DbUtil {
  val DateTimeFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")
  val DateFormat = new SimpleDateFormat("yyyy-MM-dd")

  def safetize(string: String): String = {
    string.replaceAll("'", "''").replaceAll("\\n", "\\\\n")
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
