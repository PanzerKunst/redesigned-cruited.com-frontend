<?php use Roots\Sage\Cruited; ?>

<article <?php post_class(); ?>>
  <header>
    <h2 class="entry-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
  </header>
  <div class="entry-summary">
    <?= Cruited\get_the_excerpt(); ?>
  </div>
</article>
