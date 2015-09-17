<?php use Roots\Sage\Cruited;

while (have_posts()) : the_post();

    $fieldImg1920px = get_field("page_header_background_image_1920px", get_the_ID());
    $dataUrlBgImg1920px = null;
    if ($fieldImg1920px) {
        $dataUrlBgImg1920px = 'data-url-bg-img1920px="' . $fieldImg1920px["url"] . '"';
    }

    $fieldImg640px = get_field("page_header_background_image_640px", get_the_ID());
    $dataUrlBgImg640px = null;
    if ($fieldImg640px) {
        $dataUrlBgImg640px = 'data-url-bg-img640px="' . $fieldImg640px["url"] . '"';
    }
?>

  <article <?php post_class(); ?>>
    <header class="img-bg centered-contents no-img" <?= $dataUrlBgImg1920px ?> <?= $dataUrlBgImg640px ?>>
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
