<?php
use Roots\Sage\Cruited;
use Roots\Sage\Extras;

?>

<article <?php post_class(); ?>>
    <header>
        <h2 class="entry-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
    </header>
    <div class="entry-summary">
        <?php if (get_post_type() === 'post') { ?>
            <p><?= Cruited\get_post_excerpt() ?></p>
            <div><?= Extras\excerpt_more() ?></div>
        <?php } else { ?>
            <p><?= Cruited\get_page_excerpt() ?></p>
        <?php } ?>
    </div>
</article>
