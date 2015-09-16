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
