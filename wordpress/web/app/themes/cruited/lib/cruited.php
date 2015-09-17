<?php

namespace Roots\Sage\Cruited;

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
