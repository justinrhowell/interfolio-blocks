<?php

function interfolio_render_testimonial($attributes, $content) {

    $quote = isset($attributes['text']) ? $attributes['text'] : '';
    $author = isset($attributes['author']) ? $attributes['author'] : '';
    $backgroundImage = isset($attributes['backgroundImage']) ? $attributes['backgroundImage'] : null;
    $backgroundAlignment = isset($attributes['backgroundAlignment']) ? $attributes['backgroundAlignment'] : 'top';
    $style = '';
    $classes = isset($attributes['className']) ? $attributes['className'] : '';

    if(isset($backgroundImage)){
        $background_url = $backgroundImage['sizes']['full']['url'];
        $style .= "background-image: url({$background_url});background-position:center $backgroundAlignment;";
    }

    ob_start();
    echo(
        "<blockquote class=\"wp-block-quote {$classes}\" style=\"{$style}\">
            <p>{$quote}</p>
            <cite>{$author}</cite>
        </blockquote>"
    );
    return ob_get_clean();
}