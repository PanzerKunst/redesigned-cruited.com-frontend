<?php while (have_posts()) : the_post();

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
          <h1 class="entry-title"><?php the_title(); ?></h1>
          <?php get_template_part('templates/entry-meta'); ?>
        </div>
    </header>
    <div class="entry-content with-circles">
      <?php the_content(); ?>
    </div>
    <footer>
      <?php wp_link_pages(['before' => '<nav class="page-nav"><p>' . __('Pages:', 'sage'), 'after' => '</p></nav>']); ?>
    </footer>
    <?php comments_template('/templates/comments.php'); ?>
  </article>
<?php endwhile; ?>
