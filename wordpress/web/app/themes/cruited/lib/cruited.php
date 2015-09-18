<?php namespace Roots\Sage\Cruited;

/**
 * Kills widows in text
 * @see http://davidwalsh.name/word-wrap-mootools-php
 */
function word_wrapper($text, $minWords = 3) {
    $return = $text;
    $arr = explode(' ',$text);
    if(count($arr) >= $minWords) {
        $arr[count($arr) - 2].= '&nbsp;'.$arr[count($arr) - 1];
        array_pop($arr);
        $return = implode(' ',$arr);
    }
    return $return;
}

/**
 * Builds data attributes for featured images used in page header
 */
function get_data_url_bg_imgs($postId, $thumbnailId) {
    $dataUrlBgImgLarge = null;
    $dataUrlBgImgSmall = null;

    if (has_post_thumbnail($postId)) {
        $featuredImageUrl = wp_get_attachment_image_src($thumbnailId, "full" )[0];
        $dataUrlBgImgLarge = 'data-url-bg-img-large="' . $featuredImageUrl . '"';

        $fieldImg640px = get_field("featured_image_640px", $postId);
        if ($fieldImg640px) {
            $dataUrlBgImgSmall = 'data-url-bg-img-small="' . $fieldImg640px["url"] . '"';
        }
    }

    return $dataUrlBgImgLarge . " " . $dataUrlBgImgSmall;
}

/**
 * Page titles
 */
function title() {
    if (is_home()) {
        if (get_option('page_for_posts', true)) {
            return get_the_title(get_option('page_for_posts', true));
        } else {
            return __('Latest Posts', 'sage');
        }
    } elseif (is_category()) {
        $term = get_queried_object();
        return apply_filters( 'single_cat_title', $term->name );
    } elseif (is_archive() && !is_category()) {
        return get_the_archive_title();
    } elseif (is_search()) {
        return sprintf(__('Search Results for %s', 'sage'), get_search_query());
    } elseif (is_404()) {
        return __('Not Found', 'sage');
    } else {
        return get_the_title();
    }
}

/**
 * Post excerpt for category page
 */
function get_the_excerpt() {
    return get_field("short_description", get_the_ID());
}