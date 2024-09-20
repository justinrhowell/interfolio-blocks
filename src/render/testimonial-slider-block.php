<?php

function interfolio_render_testimonial_slider($attributes, $content) {
    
    if (! is_admin() ){
        wp_enqueue_script('testimonial-slider-script', plugins_url( './scripts/testimonial-slider.js', dirname( __FILE__ ) ), ['jquery']);
    }

    $classes = isset($attributes['className']) ? $attributes['className'] : '';

    ob_start();
    echo(
        "<div class=\"interfolio-testimonial-slider-block {$classes}\">
            <div class=\"interfolio-testimonial-slider\">
                {$content}
            </div>
            <div class=\"dot-container\">
            </div>
        </div>"
    );
    return ob_get_clean();
}