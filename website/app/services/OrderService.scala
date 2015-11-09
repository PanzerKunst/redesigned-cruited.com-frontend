package services

import db.OrderDto
import models.Order

object OrderService {
  def finaliseFileNames(orderId: Long) {
    val orderToFinalise = OrderDto.getOfId(orderId).get

    val finalisedCvFileName = orderToFinalise.getCvFileNameWithoutPrefix match {
      case None => None
      case Some(fileNameWithoutPrefix) => Some(orderId + Order.fileNamePrefixSeparator + fileNameWithoutPrefix)
    }

    val finalisedCoverLetterFileName = orderToFinalise.getCoverLetterFileNameWithoutPrefix match {
      case None => None
      case Some(fileNameWithoutPrefix) => Some(orderId + Order.fileNamePrefixSeparator + fileNameWithoutPrefix)
    }

    val orderWithFinalisedFileNames = orderToFinalise.copy(
      cvFileName = finalisedCvFileName,
      coverLetterFileName = finalisedCoverLetterFileName
    )

    OrderDto.update(orderWithFinalisedFileNames)

    if (orderToFinalise.cvFileName.isDefined) {
      DocumentService.renameFile(orderToFinalise.cvFileName.get, orderWithFinalisedFileNames.cvFileName.get)
    }
    if (orderToFinalise.coverLetterFileName.isDefined) {
      DocumentService.renameFile(orderToFinalise.coverLetterFileName.get, orderWithFinalisedFileNames.coverLetterFileName.get)
    }
  }
}
