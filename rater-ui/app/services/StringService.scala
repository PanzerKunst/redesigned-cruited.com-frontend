package services

import java.nio.charset.StandardCharsets
import java.util.Base64

object StringService {
  def base64Encode(string: String): String = {
    Base64.getEncoder.encodeToString(string.getBytes(StandardCharsets.UTF_8))
  }
}
