<?php
use Roots\Sage\Titles;
use Roots\Sage\Cruited;
?>

<section class="page-header img-bg centered-contents" <?= Cruited\get_data_url_bg_imgs(get_the_ID(), get_post_thumbnail_id()) ?>>
    <div>
        <h1><?= Titles\title(); ?></h1>

        <?php
        if (is_page()) {
            $subtitleField = get_field("subtitle", get_the_ID());
            if ($subtitleField) {
                echo '<h2 id="subtitle">' . $subtitleField . '</h2>';
            }
        }
        ?>
    </div>
</section>
