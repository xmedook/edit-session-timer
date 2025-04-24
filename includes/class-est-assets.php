<?php
/**
 * Assets management class
 */
class EST_Assets {
    /**
     * Initialize assets
     */
    public static function init() {
        add_action( 'elementor/editor/after_enqueue_scripts', array( self::class, 'enqueue_editor_assets' ) );
    }

    /**
     * Enqueue editor scripts and styles for Elementor.
     */
    public static function enqueue_editor_assets() {
        wp_enqueue_script(
            'est-editor-timer',
            EST_PLUGIN_URL . 'assets/js/editor-session-timer.js',
            array( 'jquery' ),
            EST_VERSION,
            true
        );
        
        wp_localize_script(
            'est-editor-timer',
            'estSettings',
            array(
                'inactivityTimeout' => (int) get_option( 'est_inactivity_timeout', 30 ),
            )
        );
        
        wp_enqueue_style(
            'est-editor-timer-style',
            EST_PLUGIN_URL . 'assets/css/editor-session-timer.css',
            array(),
            EST_VERSION
        );
    }
}