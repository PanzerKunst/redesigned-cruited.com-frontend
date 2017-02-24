package models

import java.util.Date

case class InterviewTrainingOrderInfo(id: Option[Long] = None,
                                      orderId: Long,
                                      interviewDate: Option[Date],
                                      importantForTheRole: Option[String],
                                      latestInterview: Option[String],
                                      needForImprovement: Option[String],
                                      challengingQuestions: Option[String])
