<?php

function interfolio_render_image_with_text($attributes, $content) {

    $image_url = isset($attributes['imageUrl']) ? $attributes['imageUrl'] : '';
    $size = isset($attributes['size']) ? $attributes['size'] : '350px'; 
    $color = isset($attributes['textColor']) ? $attributes['textColor'] : '#000000';
    $alignment = isset($attributes['alignment']) ? $attributes['alignment'] : 'left';

    $classes = isset($attributes['className']) ? $attributes['className'] : '';

    $style="height:{$size};";

    ob_start();
    echo(
        "<div class=\"interfolio-image-with-text-block {$classes}\" style=\"text-align:{$alignment};\">
            <div class=\"interfolio-image-with-text\">
                <img src=\"{$image_url}\" style=\"{$style}\">
                {$content}
            </div>
        </div>"
    );
    return ob_get_clean();
}