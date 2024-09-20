<?php

function interfolio_render_numbered_list_card($attributes){

    $header_text = isset($attributes['headerText']) ? $attributes['headerText'] : '';
    $description_text = isset($attributes['descriptionText']) ? $attributes['descriptionText'] : '';
    $link_text = isset($attributes['linkText']) ? $attributes['linkText'] : 'Check it Out';
    $link_url = isset($attributes['linkUrl']) ? $attributes['linkUrl'] : '#';
    $text_alignment = isset($attributes['alignment']) ? $attributes['alignment'] : 'center';
    [$p_top, $p_right, $p_bottom, $p_left] = isset($attributes['padding']) ? $attributes['padding'] : [0,0,0,0];
    [$b_top, $b_right, $b_bottom, $b_left] = isset($attributes['border']) ? $attributes['padding'] : [0,0,0,0];
    $border_color = isset($attributes['borderColor']) ? $attributes['borderColor'] : '#000';
    $text_color = isset($attributes['textColor']) ? $attributes['textColor'] : '#000';
    $link_color = isset($attributes['linkColor']) ? $attributes['linkColor'] : '#000';
    $background_color = isset($attributes['backgroundColor']) ? $attributes['backgroundColor'] : 'transparent';
    $image = isset($attributes['image']) ? $attributes['image'] : null;
    $imageSize = isset($attributes['imageSize']) ? $attributes['imageSize'] : 'full';
    $backgroundImage = isset($attributes['backgroundImage']) ? $attributes['backgroundImage'] : null;
    $title_tag = isset($attributes['titleTag']) ? $attributes['titleTag'] : 'h4';
    $image_is_clickable = isset($attributes['imageIsClickable']) ? $attributes['imageIsClickable'] : false;

    $classes = isset($attributes['className']) ? $attributes['className'] : '';

    $connector_height = isset($attributes['connectorHeight']) ? $attributes['connectorHeight'] : 275;
    $image_url = isset($image) ? $image['sizes'][$imageSize]['url'] : '';

    $flex_alignment = [
        'left' => 'flex-start',
        'center' => 'center',
        'right' => 'flex-end',
    ];

    $align_items = $flex_alignment[$text_alignment];
    
    $style = "text-align:{$text_alignment};align-items:{$align_items};";
    $style .= "padding:{$p_top}px {$p_right}px {$p_bottom}px {$p_left}px;";
    $style .= "border-top:{$b_top}px;border-right:{$b_right}px;border-bottom:{$b_bottom}px;border-left:{$b_left}px;";
    $style .= "border-style:solid; border-color:{$border_color};";
    $style .= "color:{$text_color};";

    $link_styles = "color:{$link_color};";
    if(isset($attributes['linkProperties'])){
        $link_styles .= $attributes['linkProperties']['bold'] ? "font-family: Gotham Bold;" : '';
        $link_styles .= $attributes['linkProperties']['underline'] ? "text-decoration: underline;" : '';
        $link_styles .= $attributes['linkProperties']['italic'] ? "font-style: italic;" : '';
    }

    if(isset($backgroundImage)){
        $background_url = $backgroundImage['sizes']['full']['url'];
        $style .= "background-image: url({$background_url});background-size:cover;background-position:center center;";
    } else {
        $style .= "background-color:{$background_color};";
    }

    $image_tag = isset($image_url) && !empty($image_url) ? "<img src=\"{$image_url}\" />" : "";
    
    $html = "<div class=\"numbered-list-section {$classes}\">";

    $html .= "<div class=\"interfolio-numbered-card-block-wrapper interfolio-card-block-wrapper\">";
    $html .= "<div class=\"interfolio-numbered-card-block interfolio-card-block\" style=\"{$style}\">";
    $html .= $image_is_clickable ? "<a href=\"{$link_url}\">{$image_tag}</a>": $image_tag;
    $html .= "<{$title_tag} class=\"interfolio-card-header\">{$header_text}</{$title_tag}>";
    $html .= "<span class=\"interfolio-card-description\">{$description_text}</span>";
    if(isset($attributes['showLink']) && !!$attributes['showLink']){
        $html .= "<a style=\"{$link_styles}\" class=\"interfolio-card-link\" href=\"{$link_url}\">{$link_text}";
        $html .= $attributes['linkProperties']['arrow'] ? "<i style=\"margin-left:5px\" class=\"fal fa-arrow-right\"></i>" : '';
        $html .= "</a>";
    }
    $html .= "</div>";
    $html .= "</div>";
    $html .= "<div class=\"list-line\">";
    $html .= "<span class=\"list-line-oval\"></span>";
    $html .= "<span class=\"list-line-center\"></span>";
    $html .= "<span class=\"list-line-oval oval-right\"></span>";
    $html .= "</div>";
    $html .= "<div class=\"list-section\">";
    $html .= "<div class=\"list-connector-top\">";
    $html .= "</div>";
    $html .= "<div class=\"list-number\">1";
    $html .= "</div>";
    $html .= "<div class=\"list-connector-bottom\" style=\"{$connector_height}px\">";
    $html .= "</div>";
    $html .= "</div>";
    $html .= "</div>";

    ob_start();
    echo $html;
    return ob_get_clean();
}
