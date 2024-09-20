<?php

function interfolio_render_numbered_list($attributes, $content) {
    
    if (! is_admin() ){
        wp_enqueue_script('numbered-list-script', plugins_url( './scripts/numbered-list.js', dirname( __FILE__ ) ), ['jquery']);
    }

    $classes = isset($attributes['className']) ? $attributes['className'] : '';

    ob_start();
    echo(
        "<div class=\"interfolio-numbered-list-block {$classes}\">
            <div class=\"interfolio-numbered-list\">
                {$content}
            </div>
        </div>"
    );
    return ob_get_clean();
}