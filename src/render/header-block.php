<?php

function interfolio_render_header($attributes, $content){

    $background_url = isset($attributes['backgroundUrl']) ? $attributes['backgroundUrl'] : '';
    $fallback_url= isset($attributes['fallbackUrl']) ? $attributes['fallbackUrl'] : '';

    $background_type = isset($attributes['backgroundType']) ? $attributes['backgroundType'] : '';
    $autoplay = isset($attributes['autoplay']) && $attributes['autoplay'] ? 'autoplay' : '';
    $control_class = $autoplay ? 'fa-pause' : 'fa-play';

    $classes = isset($attributes['className']) ? $attributes['className'] : '';

    $overlay_color = isset($attributes['overlayColor']) ? $attributes['overlayColor'] : '#4791C5';
    $size = isset($attributes['size']) ? $attributes['size'] : 'medium';

    [$r, $g, $b] = sscanf($overlay_color, "#%02x%02x%02x");
    $opacity = isset($attributes['overlayOpacity']) ? $attributes['overlayOpacity'] : '0.3';
    $rgba = "rgba({$r},{$g},{$b},$opacity)";

    $background = !empty($background_url) ? "linear-gradient({$rgba},{$rgba}), url({$background_url}) center center / cover no-repeat" : "{$rgba}";
    $fallbackground = !empty($fallback_url) ? "linear-gradient({$rgba},{$rgba}), url({$fallback_url}) center center / cover no-repeat" : "{$rgba}";
    $style="background:{$background};";
    $fallbackStyle= "background:{$fallbackground};";

    if ( !is_admin() ){
        wp_enqueue_script('header-script', plugins_url( './scripts/header.js', dirname( __FILE__ ) ), ['jquery']);
    }

    ob_start();
    if($background_type == 'video'){
        $fallback_class = $fallback_url ? 'header-main' : '';
        echo(
            "<div class=\"interfolio-header-block video full-width {$size} {$classes} {$fallback_class}\">
                <video id=\"interfolio-block-header-video\" class=\"header-video\" muted loop {$autoplay}>
                    <source src={$background_url} type=\"video/mp4\" />
                </video>
                <div class=\"interfolio-header-block-overlay\" style=\"{$style}\"></div>
                <div class=\"interfolio-header-block-text container\">
                    {$content}
                </div>
                <div class=\"video-controls\">
                    <button id=\"video-toggle-button\">
                        <i class=\"fal {$control_class}\"></i>
                    </button>
                </div>
            </div>"
        );
        if ($fallback_url){
        echo(
                "<div class=\"interfolio-header-block fallback-block image full-width {$size}\" style=\"{$fallbackStyle}\">
                    <div class=\"interfolio-header-block-text container\">
                        {$content}
                    </div>
                </div>"
            );
        }
    } else {
        echo(
            "<div class=\"interfolio-header-block image full-width {$size}\" style=\"{$style}\">
                <div class=\"interfolio-header-block-text container\">
                    {$content}
                </div>
            </div>"
        );
    } 

    return ob_get_clean();
}
