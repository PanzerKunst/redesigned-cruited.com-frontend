package services

import java.util.TimerTask
import javax.inject.Singleton

import db.ReportDto
import models.CruitedProduct
import play.api.Play.current
import play.api.{Logger, Play}

@Singleton
class ScoreAverageTasker extends TimerTask {
  val nbLastAssessmentsToTakeIntoAccount = Play.configuration.getInt("averageScore.nbLastAssessmentsToTakeIntoAccount").get

  var isRunning = false

  var cvAverageScore = 0
  var coverLetterAverageScore = 0
  var linkedinProfileAverageScore = 0

  def run() {
    if (!isRunning) {
      isRunning = true

      val idOfTheLastNCvReports = ReportDto.getIdsOfTheLastNReports(nbLastAssessmentsToTakeIntoAccount, CruitedProduct.DbTypeCvReview)
      val idOfTheLastNCoverLetterReports = ReportDto.getIdsOfTheLastNReports(nbLastAssessmentsToTakeIntoAccount, CruitedProduct.DbTypeCoverLetterReview)
      val idOfTheLastNLinkedinProfileReports = ReportDto.getIdsOfTheLastNReports(nbLastAssessmentsToTakeIntoAccount, CruitedProduct.DbTypeLinkedinProfileReview)

      // Merge these 3 lists of IDs, without duplicates
      val reportIds = (idOfTheLastNCvReports ++ idOfTheLastNCoverLetterReports ++ idOfTheLastNLinkedinProfileReports).toSet

      // For each ID, call ReportDto.getScoresOfOrderId(), and store the global score for each of the 1-3 assessments
      var allCvScores: List[Int] = List()
      var allCoverLetterScores: List[Int] = List()
      var allLinkedinProfileScores: List[Int] = List()

      for (id <- reportIds) {
        val assessmentScores = ReportDto.getScoresOfOrderId(id)

        assessmentScores.cvReportScores match {
          case None =>
          case Some(cvScores) => allCvScores = allCvScores :+ cvScores.globalScore
        }

        assessmentScores.coverLetterReportScores match {
          case None =>
          case Some(coverLetterScores) => allCoverLetterScores = allCoverLetterScores :+ coverLetterScores.globalScore
        }

        assessmentScores.linkedinProfileReportScores match {
          case None =>
          case Some(linkedinProfileScores) => allLinkedinProfileScores = allLinkedinProfileScores :+ linkedinProfileScores.globalScore
        }
      }

      // Process that list of global scores, into 3 averages: CV, Cover Letter and Linkedin Profile
      cvAverageScore = allCvScores.foldLeft(0)(_ + _) / allCvScores.foldLeft(0)((r, c) => r + 1)
      coverLetterAverageScore = allCoverLetterScores.foldLeft(0)(_ + _) / allCoverLetterScores.foldLeft(0)((r, c) => r + 1)
      linkedinProfileAverageScore = allLinkedinProfileScores.foldLeft(0)(_ + _) / allLinkedinProfileScores.foldLeft(0)((r, c) => r + 1)

      Logger.info("Average scores computed!")
      Logger.info("cvAverageScore: " + cvAverageScore)
      Logger.info("coverLetterAverageScore: " + coverLetterAverageScore)
      Logger.info("linkedinProfileAverageScore: " + linkedinProfileAverageScore)

      isRunning = false
    }
  }
}
