<?php

function interfolio_render_cta($attributes){
    $icon_weight = isset($attributes['iconWeight']) ? $attributes['iconWeight'] : 'fal';
    $icon_class = isset($attributes['icon']) ? $attributes['icon'] : 'fa-play';
    $icon_size = isset($attributes['iconSize']) ? $attributes['iconSize'] : '32px';
    $text = isset($attributes['text']) ? $attributes['text'] : '';
    $color = isset($attributes['textColor']) ? $attributes['textColor'] : '#FFFFFF';
    $link = isset($attributes['link']) ? $attributes['link'] : '#';
    $alignment = isset($attributes['alignment']) ? $attributes['alignment'] : 'left';
    $margin_top_bottom = isset($attributes['marginTopBottom']) ? $attributes['marginTopBottom'] : '0';
    $margin_left_right = isset($attributes['marginLeftRight']) ? $attributes['marginLeftRight'] : '0';
    $classes = isset($attributes['className']) ? $attributes['className'] : '';
    $icon_side = isset($attributes['iconSide']) ? $attributes['iconSide'] : 'left';

    $html = '';
    $html .= "<div class=\"interfolio-cta-block {$classes}\" style=\"text-align:{$alignment};margin:{$margin_top_bottom}px {$margin_left_right}px;\">";
    $html .= "<a href=\"{$link}\" style=\"color:{$color};\">";
    $html .= $icon_side == 'left' ? "<i class=\"left-side {$icon_weight} {$icon_class}\" style=\"font-size:{$icon_size};\"></i>" : '';
    $html .= "<span>{$text}</span>";
    $html .= $icon_side == 'right' ? "<i class=\"right-side {$icon_weight} {$icon_class}\" style=\"font-size:{$icon_size};\"></i>" : '';
    $html .= '</a>';
    $html .= '</div>';
    
    ob_start();
    echo $html;
    return ob_get_clean();
}
