<?php use Roots\Sage\Cruited;

while (have_posts()) : the_post(); ?>

  <article <?php post_class(); ?>>
    <header class="img-bg centered-contents" <?= Cruited\get_data_url_bg_imgs(get_the_ID(), get_post_thumbnail_id()) ?>>
        <div>
          <h1 class="entry-title"><?= Cruited\word_wrapper(get_the_title()); ?></h1>
        </div>
    </header>

    <div class="entry-content with-circles">
      <?php if (function_exists('yoast_breadcrumb')) {
          yoast_breadcrumb('<p class="yoast-breadcrumbs">','</p>');
      }

      the_content(); ?>
    </div>

    <?php get_template_part('templates/entry-meta'); ?>

    <footer>
      <?php wp_link_pages(['before' => '<nav class="page-nav"><p>' . __('Pages:', 'sage'), 'after' => '</p></nav>']); ?>
    </footer>
    <?php comments_template('/templates/comments.php'); ?>
  </article>
<?php endwhile; ?>
