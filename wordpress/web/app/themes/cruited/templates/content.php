<?php
use Roots\Sage\Cruited;
use Roots\Sage\Extras;

?>

<article <?php post_class(); ?>>
    <header>
        <h2 class="entry-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
    </header>
    <div class="entry-summary">
        <p><?= Cruited\get_excerpt() ?></p>

        <div><?= Extras\excerpt_more() ?></div>
    </div>
</article>
