package db

import javax.inject.{Inject, Singleton}

import anorm.SqlParser._
import anorm._
import models._
import models.frontend.FrontendCommentVariation
import play.api.Logger
import play.api.db.Database

import scala.collection.mutable.ListBuffer

@Singleton
class AssessmentDto @Inject()(db: Database) {
  def allDefaultComments: AllDefaultComments = {
    db.withConnection { implicit c =>
      val query = """
      select category as category_id, dc.id, trim(name_good) as green_text, trim(name_bad) as red_text, score, grouped
      from defaults dc
        inner join default_categories c on c.id = dc.category
      where dc.shw = 1
        and c.shw = 1
      order by category, dc.ordd;"""

      Logger.info("AssessmentDto.getAllDefaultComments():" + query)

      val rowParser = long("category_id") ~ long("id") ~ str("green_text") ~ str("red_text") ~ int("score") ~ int("grouped") map {
        case categoryId ~ id ~ greenText ~ redText ~ points ~ grouped =>

          val defaultComment = DefaultComment(
            id = id,
            categoryId = categoryId,
            greenText = greenText,
            redText = redText,
            points = points,
            isGrouped = grouped match {
              case DefaultComment.dbGroupedFalse => false
              case _ => true
            }
          )

          (defaultComment, CruitedProduct.codeFromCategoryId(categoryId))
      }

      process(SQL(query).as(rowParser.*))
    }
  }

  def allCommentVariations: List[FrontendCommentVariation] = {
    db.withConnection { implicit c =>
      val query = """
      select v.id, variation,
        dc.id as id_default, category as category_id, trim(name_good) as name_good, trim(name_bad) as name_bad, dc.type as doc_type, score, grouped,
        variation_type.tag_type, variation_type.edition_id as tag_id
      from default_variations v
        inner join defaults dc on dc.id = v.id_default
        inner join default_categories c on c.id = dc.category
        inner join product_edition_variation variation_type on variation_type.variation_id = v.id
      where v.shw = 1
        and dc.shw = 1
        and c.shw = 1
      order by id_default, tag_type;"""

      Logger.info("AssessmentDto.getAllCommentVariations():" + query)

      val rowParser = long("id") ~ str("variation") ~
        long("id_default") ~ long("category_id") ~ str("name_good") ~ str("name_bad") ~ str("doc_type") ~ int("score") ~ int("grouped") ~
        str("tag_type") ~ long("tag_id") map {
        case id ~ text ~
          defaultCommentId ~ categoryId ~ greenText ~ redText ~ dbDocType ~ points ~ grouped ~
          tagType ~ tagId =>

          FrontendCommentVariation(
            id = id,
            defaultComment = DefaultComment(
              id = defaultCommentId,
              categoryId = categoryId,
              greenText = greenText,
              redText = redText,
              points = points,
              isGrouped = grouped match {
                case DefaultComment.dbGroupedFalse => false
                case _ => true
              }
            ),
            text = text,
            editionId = tagType match {
              case CommentVariation.dbTagTypeEdition => Some(tagId)
              case _ => None
            }
          )
      }

      SQL(query).as(rowParser.*)
    }
  }

  /**
   * @param allComments (DefaultComment, CruitedProduct.codeXYZ)
   */
  private def process(allComments: List[(DefaultComment, String)]): AllDefaultComments = {
    val cvDefaultComments = new ListBuffer[DefaultComment]
    val coverLetterDefaultComments = new ListBuffer[DefaultComment]
    val linkedinProfileDefaultComments = new ListBuffer[DefaultComment]

    for ((defaultComment, productCode) <- allComments) {
      productCode match {
        case CruitedProduct.codeCvReview => cvDefaultComments += defaultComment;
        case CruitedProduct.codeCoverLetterReview => coverLetterDefaultComments += defaultComment;
        case _ => linkedinProfileDefaultComments += defaultComment;
      }
    }

    AllDefaultComments(
      cv = cvDefaultComments.toList,
      coverLetter = coverLetterDefaultComments.toList,
      linkedinProfile = linkedinProfileDefaultComments.toList
    )
  }
}
