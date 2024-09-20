<?php

function interfolio_render_signature($attributes){
    
    $image = isset($attributes['image']) ? $attributes['image']['sizes']['full']['url'] : 'http://1.gravatar.com/avatar/dfaf20f50dd0a89a3331d67286e71f60?s=96&d=mm&r=g';
    $author_name = isset($attributes['authorName']) ? $attributes['authorName'] : '';
    $body_text = isset($attributes['bodyText']) ? $attributes['bodyText'] : '';
    $classes = isset($attributes['className']) ? $attributes['className'] : '';
    
    $html = "<div class=\"signature-block-container {$classes}\">";
    $html .= "<div class=\"image-container\">";
    $html .= "<img src=\"{$image}\" alt=\"author avatar\" />";
    $html .= "</div>";
    $html .= "<div class=\"text-container\">";
    $html .= "<span class=\"author-name\">{$author_name}</span>";
    $html .= $body_text ? "<p class=\"body-text\">{$body_text}</p>" : '';
    $html .= "</div>";
    $html .= "</div>";
    
    ob_start();
    echo $html;
    return ob_get_clean();
}
