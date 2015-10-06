<?php namespace Roots\Sage\Cruited;

/**
 * Kills widows in text
 * @see http://davidwalsh.name/word-wrap-mootools-php
 */
function word_wrapper($text, $minWords = 3) {
    $return = $text;
    $arr = explode(' ', $text);

    if (count($arr) >= $minWords) {
        $arr[count($arr) - 2] .= '&nbsp;' . $arr[count($arr) - 1];
        array_pop($arr);
        $return = implode(' ', $arr);
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
        $featuredImageUrl = wp_get_attachment_image_src($thumbnailId, "full")[0];
        $dataUrlBgImgLarge = 'data-url-bg-img-large="' . $featuredImageUrl . '"';

        $fieldImg960px = get_field("featured_image_960px", $postId);
        if ($fieldImg960px) {
            $dataUrlBgImgSmall = 'data-url-bg-img-small="' . $fieldImg960px["url"] . '"';
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
        return apply_filters('single_cat_title', $term->name);
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
 * Post or page excerpt
 */
function get_excerpt() {
    if (get_post_type() === 'post') {
        return get_post_excerpt();
    };

    return get_page_excerpt();
}

/**
 * Post excerpt
 */
function get_post_excerpt() {
    return get_field("short_description", get_the_ID());
}

/**
 * Page excerpt
 */
function get_page_excerpt() {
    $sharing_buttons_excerpt_text = "Facebook LinkedIn Twitter Email";
    $excerpt = get_the_excerpt();
    if (starts_with($excerpt, $sharing_buttons_excerpt_text)) {
        $excerpt = substr($excerpt, strlen($sharing_buttons_excerpt_text));
    }

    return $excerpt;
}

/**
 * String utility functions
 */
function starts_with($haystack, $needle) {
    // search backwards starting from haystack length characters from the end
    return $needle === "" || strrpos($haystack, $needle, -strlen($haystack)) !== FALSE;
}

function ends_with($haystack, $needle) {
    // search forward starting from end minus needle length characters
    return $needle === "" || (($temp = strlen($haystack) - strlen($needle)) >= 0 && strpos($haystack, $needle, $temp) !== FALSE);
}


function filter_child_categories($query) {
    if ($query->is_category) {
        $queried_object = get_queried_object();
        $child_cats = (array)get_term_children($queried_object->term_id, 'category');

        if (!$query->is_admin)
            //exclude the posts in child categories
            $query->set('category__not_in', array_merge($child_cats));
    }

    return $query;
}

add_filter('pre_get_posts', __NAMESPACE__ . '\filter_child_categories');
