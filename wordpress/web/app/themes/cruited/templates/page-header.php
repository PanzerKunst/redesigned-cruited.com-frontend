<?php use Roots\Sage\Titles;

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

<section class="page-header img-bg centered-contents no-img" <?= $dataUrlBgImg1920px ?> <?= $dataUrlBgImg640px ?>>
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
