<?php while (have_posts()) : the_post(); ?>
  <?php get_template_part('templates/page', 'header-page'); ?>
  <?php get_template_part('templates/content', 'page'); ?>
<?php endwhile; ?>
