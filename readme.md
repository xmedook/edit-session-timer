# Edit Session Timer

> A WordPress plugin that adds a session timer to track your editing time in Elementor

**Version:** 0.4.0  
**Author:** koode.mx

Edit Session Timer injects a live session timer below the Publish/Update button in the Elementor v2 editor UI. It displays elapsed time in mm:ss format and resets on each button click.
### Features
- Injects timer inside the "Publicar" (Publish) button in Elementor v2 editor.
- Formats time as mm:ss, starting at 00:00.
- Automatically resets timer when the Publish/Update button is clicked.
- Pauses after configurable period of inactivity (default: 30 seconds).
- Resumes timer with accumulated time when activity is detected.
- Uses MutationObserver and Elementor events to detect UI changes.
- Minimal CSS to match Elementor button styling.
- Settings page to configure inactivity timeout.

### Installation

#### Manual Installation
1. Copy the `edit-session-timer` folder into your WordPress `wp-content/plugins/` directory.
2. Activate the plugin from the **Plugins** screen in WordPress admin.
3. Open any page or post in the Elementor editor; you will see the timer appear inside the Publish/Update button.

#### Using SSH/Git
1. SSH into your server and navigate to your WordPress plugins directory:
   ```
   cd path/to/wp-content/plugins/
   ```
2. Clone the repository:
   ```
   git clone git@github.com:xmedook/edit-session-timer.git
   ```
3. Set proper permissions:
   ```
   chmod -R 755 edit-session-timer
   ```
4. Activate the plugin from the **Plugins** screen in WordPress admin.

### Requirements
- WordPress 5.0 or higher
- Elementor 3.x (tested on 3.11+)
### Changelog
#### 0.4.0
* Streamlined inactivity logic: single session timer that pauses after inactivity if no click or keypress in the editor body
* Removed secondary countdown display and related code
* Added `console.log` messages on pause (`[EST] Timer paused due to inactivity`) and resume (`[EST] Timer resumed`)
* Cleaned up console.info noise (init logs, MutationObserver chatter)

#### 0.3.0
- Added inactivity timeout feature that pauses the timer after a period of inactivity
- Added admin menu under "Edit Sessions" with a Settings page
- Implemented click detection within the Elementor editor to reset inactivity timeout
- Timer now preserves elapsed time when paused and resumes correctly on activity

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