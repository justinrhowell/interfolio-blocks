<?php

function interfolio_render_content_filter($attributes) {
    $categories = $attributes['categories'];
    $classes = isset($attributes['className']) ? $attributes['className'] : '';
    if ( !is_admin() ){
        wp_enqueue_script('content-filter-script', plugins_url( './scripts/content-filter.js', dirname( __FILE__ ) ), ['jquery']);
    }
    $id = uniqid();
    $json_atts = json_encode($attributes);
    $html = "<script>";
    $html .= "var blockmeta_{$id} = {
        atts: {$json_atts},
        totalResults: 0
    };";
    $html .= "</script>";

    $html .= "<div class=\"interfolio-content-filter-block container-{$id} {$classes}\" data-id=\"{$id}\">";

    $mobile_select = "<div class=\"category-select-mobile-wrapper\"><select class=\"category-select-mobile\">";
    $desktop_select = "<div class=\"category-select-desktop\">";
    $i = 0;
    foreach( $categories as $category ){
        $desktop_select .= "<button class=\"desktop-category-select\" data-category=\"{$category['id']}\">{$category['name']}</button>";
        $desktop_select .= $i !== count($categories) - 1 ? "<span class=\"divider\">|</span>" : "";
        $selected = $i == 0 ? 'selected' : '';
        $mobile_select .= "<option value=\"{$category['id']}\" {$selected}>{$category['name']}</option>";
        $i++;
    }
    $desktop_select .= "</div>";
    $mobile_select .= "</select></div>";
    
    if(isset($attributes['exposeControlsToUser']) && $attributes['exposeControlsToUser']){
        $html .= "<div class=\"categories-container\">";
        $html .= $desktop_select;
        $html .= $mobile_select;
        $html .= "</div>"; //.categories-container
    }

    $html .= "<div class=\"results-container\"></div>";
    $html .= "<div class=\"error-message-container\"></div>";
    $html .= "<div class=\"pagination-controls-container\">";
    $html .= "<div class=\"pagination-previous-container\"></div>";
    $html .= "<div class=\"pagination-next-container\"></div>";
    $html .= "</div>";

    
    $html .= "</div>"; //.interfolio-content-filter-block

    ob_start();
    echo $html;
    return ob_get_clean();
}