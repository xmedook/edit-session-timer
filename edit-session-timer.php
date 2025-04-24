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

// Define plugin constants
define( 'EST_VERSION', '0.4.0' );
define( 'EST_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'EST_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

// Load required files
require_once EST_PLUGIN_DIR . 'includes/class-est-assets.php';
require_once EST_PLUGIN_DIR . 'includes/class-est-settings.php';
require_once EST_PLUGIN_DIR . 'includes/class-est-admin-menu.php';

// Initialize plugin components
EST_Assets::init();
EST_Settings::init();
EST_Admin_Menu::init();