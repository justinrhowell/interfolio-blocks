<?php

function interfolio_render_motion_container($attributes, $content) {

    $motion = isset($attributes['motion']) ? $attributes['motion'] : '';
    $classes = isset($attributes['className']) ? $attributes['className'] : '';

    ob_start();
    echo(
        "<div class=\"{$classes}\" data-aos=\"$motion\">
            {$content}
        </div>"
    );
    return ob_get_clean();
}