<?php
/**
 * Blocks Initializer
 *
 * Enqueue CSS/JS of all the blocks.
 *
 * @since   1.0.0
 * @package CGB
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Render Callbacks
 */
require_once 'render/card-block.php';
require_once 'render/card-container-block.php';
require_once 'render/content-filter-block.php';
require_once 'render/cta-block.php';
require_once 'render/header-block.php';
require_once 'render/image-with-text-block.php';
require_once 'render/testimonial-slider-block.php';
require_once 'render/testimonial-block.php';
require_once 'render/motion-container-block.php';
require_once 'render/signature-block.php';
require_once 'render/numbered-list-block.php';
require_once 'render/numbered-list-card-block.php';
require_once 'render/marketo-form.php';

/**
 * Enqueue Gutenberg block assets for both frontend + backend.
 *
 * Assets enqueued:
 * 1. blocks.style.build.css - Frontend + Backend.
 * 2. blocks.build.js - Backend.
 * 3. blocks.editor.build.css - Backend.
 *
 * @uses {wp-blocks} for block type registration & related functions.
 * @uses {wp-element} for WP Element abstraction — structure of blocks.
 * @uses {wp-i18n} to internationalize the block's text.
 * @uses {wp-editor} for WP editor styles.
 * @since 1.0.0
 */
function interfolio_blocks_cgb_block_assets() { // phpcs:ignore
	// Register block styles for both frontend + backend.
	wp_register_style(
		'interfolio_blocks-cgb-style-css', // Handle.
		plugins_url( 'dist/blocks.style.build.css', dirname( __FILE__ ) ), // Block style CSS.
		array( 'wp-editor' ), // Dependency to include the CSS after it.
		null // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.style.build.css' ) // Version: File modification time.
	);

	// Register block editor script for backend.
	wp_register_script(
		'interfolio_blocks-cgb-block-js', // Handle.
		plugins_url( '/dist/blocks.build.js', dirname( __FILE__ ) ), // Block.build.js: We register the block here. Built with Webpack.
		array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor' ), // Dependencies, defined above.
		null, // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.build.js' ), // Version: filemtime — Gets file modification time.
		true // Enqueue the script in the footer.
	);

	// Register block editor styles for backend.
	wp_register_style(
		'interfolio_blocks-cgb-block-editor-css', // Handle.
		plugins_url( 'dist/blocks.editor.build.css', dirname( __FILE__ ) ), // Block editor CSS.
		array( 'wp-edit-blocks' ), // Dependency to include the CSS after it.
		null // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.editor.build.css' ) // Version: File modification time.
	);

	// WP Localized globals. Use dynamic PHP stuff in JavaScript via `cgbGlobal` object.
	wp_localize_script(
		'interfolio_blocks-cgb-block-js',
		'cgbGlobal', // Array containing dynamic data for a JS Global.
		[
			'pluginDirPath' => plugin_dir_path( __DIR__ ),
			'pluginDirUrl'  => plugin_dir_url( __DIR__ ),
			// Add more data here that you want to access from `cgbGlobal` object.
		]
	);

	/**
	 * Register Gutenberg block on server-side.
	 *
	 * Register the block on server-side to ensure that the block
	 * scripts and styles for both frontend and backend are
	 * enqueued when the editor loads.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/blocks/writing-your-first-block-type#enqueuing-block-scripts
	 * @since 1.16.0
	 */

	$common_assets = [
		'style'         => 'interfolio_blocks-cgb-style-css',
		'editor_script' => 'interfolio_blocks-cgb-block-js',
		'editor_style'  => 'interfolio_blocks-cgb-block-editor-css',
	];

	register_block_type( 'interfolio/block-interfolio-header', array_merge($common_assets,  ['render_callback' => 'interfolio_render_header']) );
	register_block_type( 'interfolio/block-interfolio-cta', array_merge($common_assets,  ['render_callback' => 'interfolio_render_cta']) );
	register_block_type( 'interfolio/block-interfolio-image-with-text', array_merge($common_assets, ['render_callback' => 'interfolio_render_image_with_text']) );
	register_block_type( 'interfolio/block-card-container', array_merge($common_assets, ['render_callback' => 'interfolio_render_card_container']) );
	register_block_type( 'interfolio/block-card', array_merge($common_assets, ['render_callback' => 'interfolio_render_card']) );
	register_block_type( 'interfolio/block-testimonial-slider', array_merge($common_assets, ['render_callback' => 'interfolio_render_testimonial_slider']) );
	register_block_type( 'interfolio/block-content-filter', array_merge($common_assets, ['render_callback' => 'interfolio_render_content_filter'])  );
	register_block_type( 'interfolio/block-testimonial', array_merge($common_assets, ['render_callback' => 'interfolio_render_testimonial'])  );
	register_block_type( 'interfolio/block-motion-container', array_merge($common_assets, ['render_callback' => 'interfolio_render_motion_container'])  );
	register_block_type( 'interfolio/block-signature', array_merge($common_assets, ['render_callback' => 'interfolio_render_signature'])  );
	register_block_type( 'interfolio/block-numbered-list', array_merge($common_assets, ['render_callback' => 'interfolio_render_numbered_list'])  );
	register_block_type( 'interfolio/block-numbered-list-card', array_merge($common_assets, ['render_callback' => 'interfolio_render_numbered_list_card'])  );
	register_block_type( 'interfolio/block-background-graphic', $common_assets );
	register_block_type( 'interfolio/block-marketo-form', array_merge($common_assets, ['render_callback' => 'interfolio_render_marketo_form']) );
}

// Hook: Block assets.
add_action( 'init', 'interfolio_blocks_cgb_block_assets' );
