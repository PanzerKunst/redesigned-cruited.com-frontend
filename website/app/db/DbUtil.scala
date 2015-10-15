package db

object DbUtil {
  def safetize(string: String): String = {
    string.replaceAll("'", "''")
  }

  def parseToList[T](string: String): List[T] = {
    val arrayOfString = string.split(',')

    arrayOfString.map { item =>
      item.asInstanceOf[T]
    }.toList
  }
}
