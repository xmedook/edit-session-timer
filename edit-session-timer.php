<?php
/**
 * Plugin Name: Edit Session Timer
 * Description: Adds a session timer below the Publish/Update button in Elementor editor.
 * Version:     0.2.0
 * Author:      koode.mx
 * Text Domain: edit-session-timer
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

/**
 * Enqueue editor scripts and styles for Elementor.
 */
function est_enqueue_editor_assets() {
    wp_enqueue_script(
        'est-editor-timer',
        plugin_dir_url( __FILE__ ) . 'assets/js/editor-session-timer.js',
        array( 'jquery' ),
        '0.2.0',
        true
    );
    wp_enqueue_style(
        'est-editor-timer-style',
        plugin_dir_url( __FILE__ ) . 'assets/css/editor-session-timer.css',
        array(),
        '0.2.0'
    );
}
// Enqueue our assets when Elementor editor scripts are enqueued
add_action( 'elementor/editor/after_enqueue_scripts', 'est_enqueue_editor_assets' );