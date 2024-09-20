<?php

function interfolio_render_marketo_form($attributes, $content){
    $formId = isset($attributes['formId']) ? $attributes['formId'] : '';
    $formBorderColor = isset($attributes['formBorderColor']) ? $attributes['formBorderColor'] : '';
    $formFontColor = isset($attributes['formFontColor']) ? $attributes['formFontColor'] : '';

    if( !is_admin() ){
        wp_enqueue_script('marketo-form-script', plugins_url( './scripts/marketo-form.js', dirname( __FILE__ ) ), ['jquery']);
    }

    ob_start();
    echo(
        "<script src=\"//info.interfolio.com/js/forms2/js/forms2.min.js\"></script>
        <form id=\"mktoForm_{$formId}\"></form>
        <script>MktoForms2.loadForm(\"//info.interfolio.com\", \"770-JDV-251\", ${formId});</script>"
    );
    return ob_get_clean();
}
