package services

object NumberService {
  def roundAt(precision: Int, number: Double): Double = {
    val s = math pow(10, precision)
    (math round number * s) / s
  }
}
