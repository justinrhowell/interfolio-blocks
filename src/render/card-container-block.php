<?php

function interfolio_render_card_container($attributes, $content){
    $columns = isset($attributes['columns']) ? $attributes['columns'] : 3;
    $grid_background_color = isset($attributes['gridBackgroundColor']) ? $attributes['gridBackgroundColor'] : 'transparent';
    $grid_class = '';
    $card_height = isset($attributes['cardHeight']) ? $attributes['cardHeight'] : '';
    $grid_style = "background-color:{$grid_background_color};";
    if(!empty($card_height)){
        $overlow_behavior = isset($attributes['overflowBehavior']) ? $attributes['overflowBehavior'] : 'scroll';
        $grid_class .= ' has-custom-card-height';
        $grid_style .= "--card-height:{$card_height}px;--overflow-behavior:{$overlow_behavior};";
    } else {
        $grid_class .= isset($attributes['equalizeHeight']) && $attributes['equalizeHeight'] ? ' equalize-height' : '';
    }

    $classes = isset($attributes['className']) ? $attributes['className'] : '';

    if( !is_admin() ){
        wp_enqueue_script('card-container-script', plugins_url( './scripts/card-container.js', dirname( __FILE__ ) ), ['jquery']);
    }

    ob_start();
    echo(
        "<div class=\"interfolio-card-container-block {$classes}\" style=\"--columns:{$columns};\">
            <div class=\"card-grid {$grid_class}\" style=\"{$grid_style}\">
                {$content}
            </div>
        </div>"
    );
    return ob_get_clean();
}
