## Edit Session Timer

Version: 0.2.0
Author: koode.mx

Edit Session Timer injects a live session timer below the Publish/Update button in the Elementor v2 editor UI. It displays elapsed time in mm:ss format and resets on each button click.

### Features
- Injects timer inside the "Publicar" (Publish) button in Elementor v2 editor.
- Formats time as mm:ss, starting at 00:00.
- Automatically resets timer when the Publish/Update button is clicked.
- Uses MutationObserver and Elementor events to detect UI changes.
- Minimal CSS to match Elementor button styling.

### Installation
1. Copy the `edit-session-timer` folder into your WordPress `wp-content/plugins/` directory.
2. Activate the plugin from the **Plugins** screen in WordPress admin.
3. Open any page or post in the Elementor editor; you will see the timer appear inside the Publish/Update button.

### Requirements
- WordPress 5.0 or higher
- Elementor 3.x (tested on 3.11+)

### Changelog
#### 0.2.0
- Hide timer when the Publish button spinner is present and show again after loading completes.
- Ensure the timer remains positioned after the button text once the spinner is removed.
- Timer runs only when the button is active (not disabled).
- Cleaned up debug instrumentation from JS and PHP code.

#### 0.1.0
- Initial release: basic timer injection for Elementor editor UI.

### Development Notes
- All debug messages use `console.info('EST: ...')` with the `EST:` prefix.
- JavaScript entry point: `assets/js/editor-session-timer.js`
- CSS entry point: `assets/css/editor-session-timer.css`
- Main plugin file: `edit-session-timer.php`

### License
Released under the GPLv2 (or later) license.