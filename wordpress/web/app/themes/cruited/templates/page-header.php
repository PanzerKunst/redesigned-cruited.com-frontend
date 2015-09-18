<?php use Roots\Sage\Cruited; ?>

<section class="page-header img-bg no-img centered-contents">
    <div>
        <h1><?= Cruited\title(); ?></h1>
        <?php
        if (function_exists('yoast_breadcrumb') && substr_count($_SERVER['REQUEST_URI'], '/') > 2) {
            yoast_breadcrumb('<p class="yoast-breadcrumbs">','</p>');
        } ?>
    </div>
</section>
