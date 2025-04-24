<?php
/**
 * Plugin Name: Edit Session Timer
 * Description: Adds a session timer below the Publish/Update button in Elementor editor.
 * Version:     0.4.0
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
        '0.4.0',
        true
    );
    
    // Pass inactivity timeout setting to JS
    wp_localize_script(
        'est-editor-timer',
        'estSettings',
        array(
            'inactivityTimeout' => (int) get_option( 'est_inactivity_timeout', 30 ),
        )
    );
    
    wp_enqueue_style(
        'est-editor-timer-style',
        plugin_dir_url( __FILE__ ) . 'assets/css/editor-session-timer.css',
        array(),
        '0.4.0'
    );
}
// Enqueue our assets when Elementor editor scripts are enqueued
add_action( 'elementor/editor/after_enqueue_scripts', 'est_enqueue_editor_assets' );

// Register plugin settings
add_action( 'admin_init', 'est_register_settings' );
function est_register_settings() {
    register_setting(
        'est_settings',
        'est_inactivity_timeout',
        array(
            'type'              => 'integer',
            'sanitize_callback' => 'absint',
            'default'           => 30,
        )
    );
    add_settings_section(
        'est_section_general',
        __( 'General Settings', 'edit-session-timer' ),
        '__return_false',
        'est_edit_sessions'
    );
    add_settings_field(
        'est_inactivity_timeout',
        __( 'Inactivity Timeout (seconds)', 'edit-session-timer' ),
        'est_inactivity_timeout_field_cb',
        'est_edit_sessions',
        'est_section_general'
    );
}

/**
 * Settings field callback for inactivity timeout.
 */
function est_inactivity_timeout_field_cb() {
    $val = get_option( 'est_inactivity_timeout', 30 );
    printf(
        '<input name="est_inactivity_timeout" type="number" id="est_inactivity_timeout" value="%d" min="5" max="3600" class="small-text" />',
        esc_attr( $val )
    );
    echo '<p class="description">' . esc_html__( 'Number of seconds of inactivity before the timer pauses. Minimum 5 seconds, maximum 3600 seconds (1 hour).', 'edit-session-timer' ) . '</p>';
}

/**
 * Add Admin menu for Edit Sessions settings.
 */
function est_admin_menu() {
    // Top-level menu
    add_menu_page(
        'Edit Sessions',
        'Edit Sessions',
        'manage_options',
        'est_edit_sessions',
        'est_settings_page',
        'dashicons-clock',
        81
    );
    // Settings submenu (same page)
    add_submenu_page(
        'est_edit_sessions',
        'Settings',
        'Settings',
        'manage_options',
        'est_edit_sessions',
        'est_settings_page'
    );
}
add_action( 'admin_menu', 'est_admin_menu' );

/**
 * Render the Settings page.
 */
function est_settings_page() {
    ?>
    <div class="wrap">
        <h1>Edit Sessions Settings</h1>
        <form method="post" action="options.php">
            <?php
            settings_fields( 'est_settings' );
            do_settings_sections( 'est_edit_sessions' );
            submit_button();
            ?>
        </form>
    </div>
    <?php
}
// Duplicate admin menu and settings page definitions removed.