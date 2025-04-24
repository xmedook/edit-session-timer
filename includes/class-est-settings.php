<?php
/**
 * Settings management class
 */
class EST_Settings {
    /**
     * Initialize settings
     */
    public static function init() {
        add_action( 'admin_init', array( self::class, 'register_settings' ) );
    }

    /**
     * Register plugin settings
     */
    public static function register_settings() {
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
            array( self::class, 'render_timeout_field' ),
            'est_edit_sessions',
            'est_section_general'
        );
    }

    /**
     * Settings field callback for inactivity timeout.
     */
    public static function render_timeout_field() {
        $val = get_option( 'est_inactivity_timeout', 30 );
        printf(
            '<input name="est_inactivity_timeout" type="number" id="est_inactivity_timeout" value="%d" min="5" max="3600" class="small-text" />',
            esc_attr( $val )
        );
        echo '<p class="description">' . esc_html__( 'Number of seconds of inactivity before the timer pauses. Minimum 5 seconds, maximum 3600 seconds (1 hour).', 'edit-session-timer' ) . '</p>';
    }
}