<?php
use Roots\Sage\Cruited;
use Roots\Sage\Extras;

?>

<article <?php post_class(); ?>>
    <header>
        <h2 class="entry-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
    </header>
    <div class="entry-summary">
        <p>
            <?php if (get_post_type() === 'post') {
                echo Cruited\get_post_excerpt() . Extras\excerpt_more();
            } else {
                echo Cruited\get_page_excerpt();
            } ?>
        </p>
    </div>
</article>
