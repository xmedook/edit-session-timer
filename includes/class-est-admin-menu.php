<?php
/**
 * Admin menu management class
 */
class EST_Admin_Menu {
    /**
     * Initialize admin menu
     */
    public static function init() {
        add_action( 'admin_menu', array( self::class, 'register_menu' ) );
    }

    /**
     * Register admin menu items
     */
    public static function register_menu() {
        add_menu_page(
            'Edit Sessions',
            'Edit Sessions',
            'manage_options',
            'est_edit_sessions',
            array( self::class, 'render_settings_page' ),
            'dashicons-clock',
            81
        );
        
        add_submenu_page(
            'est_edit_sessions',
            'Settings',
            'Settings',
            'manage_options',
            'est_edit_sessions',
            array( self::class, 'render_settings_page' )
        );
    }

    /**
     * Render the settings page
     */
    public static function render_settings_page() {
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
}