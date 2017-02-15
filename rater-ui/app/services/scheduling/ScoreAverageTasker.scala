package services

import java.util.TimerTask
import javax.inject.{Inject, Singleton}

import db.AssessmentDto
import models.CruitedProduct
import play.api.Logger

@Singleton
class ScoreAverageTasker @Inject()(assessmentDto: AssessmentDto, config: GlobalConfig) extends TimerTask {
  var isRunning = false

  var cvAverageScore = 0
  var coverLetterAverageScore = 0
  var linkedinProfileAverageScore = 0

  def run() {
    if (!isRunning) {
      isRunning = true

      val idOfTheLastNCvReports = assessmentDto.getIdsOfTheLastNReports(config.nbLastAssessmentsToTakeIntoAccount, CruitedProduct.dbTypeCvReview)
      val idOfTheLastNCoverLetterReports = assessmentDto.getIdsOfTheLastNReports(config.nbLastAssessmentsToTakeIntoAccount, CruitedProduct.dbTypeCoverLetterReview)
      val idOfTheLastNLinkedinProfileReports = assessmentDto.getIdsOfTheLastNReports(config.nbLastAssessmentsToTakeIntoAccount, CruitedProduct.dbTypeLinkedinProfileReview)

      // Merge these 3 lists of IDs, without duplicates
      val reportIds = (idOfTheLastNCvReports ++ idOfTheLastNCoverLetterReports ++ idOfTheLastNLinkedinProfileReports).toSet

      // For each ID, call ReportDto.getScoresOfOrderId(), and store the global score for each of the 1-3 assessments
      var allCvScores: List[Int] = List()
      var allCoverLetterScores: List[Int] = List()
      var allLinkedinProfileScores: List[Int] = List()

      for (id <- reportIds) {
        val assessmentScores = assessmentDto.getScoresOfOrderId(id)

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
      cvAverageScore = allCvScores.sum / allCvScores.foldLeft(0)((r, _) => r + 1)
      coverLetterAverageScore = allCoverLetterScores.sum / allCoverLetterScores.foldLeft(0)((r, _) => r + 1)
      linkedinProfileAverageScore = allLinkedinProfileScores.sum / allLinkedinProfileScores.foldLeft(0)((r, _) => r + 1)

      Logger.info("Average scores computed!")
      Logger.info("cvAverageScore: " + cvAverageScore)
      Logger.info("coverLetterAverageScore: " + coverLetterAverageScore)
      Logger.info("linkedinProfileAverageScore: " + linkedinProfileAverageScore)

      isRunning = false
    }
  }
}
