 ( function( $ ) {
    console.info('EST: editor-session-timer.js loaded');
    var estStartTime = null;
    var estTimerInterval = null;

    function formatTime( ms ) {
        var totalSeconds = Math.floor( ms / 1000 );
        var minutes = Math.floor( totalSeconds / 60 );
        var seconds = totalSeconds % 60;
        return ( '0' + minutes ).slice( -2 ) + ':' + ( '0' + seconds ).slice( -2 );
    }

    function startTimer( timerEl ) {
        estStartTime = Date.now();
        timerEl.text( '00:00' );
        if ( estTimerInterval ) {
            clearInterval( estTimerInterval );
        }
        estTimerInterval = setInterval( function() {
            var elapsed = Date.now() - estStartTime;
            timerEl.text( formatTime( elapsed ) );
        }, 1000 );
    }
    /**
     * Stops the running timer interval.
     */
    function stopTimer() {
        if ( estTimerInterval ) {
            clearInterval( estTimerInterval );
            estTimerInterval = null;
            console.info('EST: stopTimer called, timer stopped');
        }
    }

    function initTimer() {
        console.info('EST: initTimer called');
        // Detect new Elementor v2 editor UI
        var editorWrapper = $( '#elementor-editor-wrapper-v2' );
        if ( editorWrapper.length ) {
            console.info('EST: initTimer: using Elementor v2 UI');
            var pubGroup = editorWrapper.find('div[role="group"].MuiButtonGroup-root.MuiButtonGroup-contained');
            var pubButton = pubGroup.find('button.MuiButton-containedPrimary').first();
            if ( ! pubButton.length ) {
                console.info('EST: initTimer: publish button not found in new UI');
                return;
            }
            if ( pubButton.find('#est-session-timer').length ) {
                console.info('EST: initTimer: timer already exists in new UI');
                return;
            }
            console.info('EST: initTimer: pubButton element:', pubButton);
            var timerEl = $( '<span id="est-session-timer">00:00</span>' );
            console.info('EST: initTimer: creating timer element', timerEl);
            pubButton.append( timerEl );
            console.info('EST: initTimer: appended timer inside new UI button');
            // Observe disabled/enabled state and spinner presence
            ( function() {
                var spinnerVisible = pubButton.find( '.MuiCircularProgress-root' ).length > 0;
                var btnObserver = new MutationObserver( function( mutations ) {
                    // Handle disabled state
                    mutations.forEach( function( m ) {
                        if ( m.type === 'attributes' && m.attributeName === 'disabled' ) {
                            if ( pubButton.prop( 'disabled' ) ) {
                                console.info('EST: initTimer: button disabled, stopping timer');
                                stopTimer();
                            } else {
                                console.info('EST: initTimer: button enabled, starting timer');
                                startTimer( timerEl );
                            }
                        }
                    } );
                    // Check spinner presence transition
                    var newSpinnerVisible = pubButton.find( '.MuiCircularProgress-root' ).length > 0;
                    if ( newSpinnerVisible && !spinnerVisible ) {
                        console.info('EST: initTimer: spinner detected, hiding timer');
                        timerEl.hide();
                    } else if ( !newSpinnerVisible && spinnerVisible ) {
                        console.info('EST: initTimer: spinner removed, showing timer');
                        timerEl.show();
                        // Move timer to end once
                        pubButton.append( timerEl );
                        console.info('EST: initTimer: moved timer to end of button');
                    }
                    spinnerVisible = newSpinnerVisible;
                } );
                btnObserver.observe( pubButton[0], { attributes: true, attributeFilter: [ 'disabled' ], childList: true, subtree: true } );
            } )();
            // Initial state: start or stop timer based on button enabled state
            if ( pubButton.prop( 'disabled' ) ) {
                console.info('EST: initTimer: button initially disabled, timer not started');
            } else {
                console.info('EST: initTimer: button initially enabled, starting timer');
                startTimer( timerEl );
            }
            // Reset timer on button click (publish/update)
            pubButton.on( 'click', function() {
                console.info('EST: publish button clicked, restarting timer');
                startTimer( timerEl );
            } );
            return;
        }
        // Fallback for older Elementor editor UI
        var footer = $( '.elementor-panel-footer' );
        if ( ! footer.length ) {
            console.info('EST: initTimer: no footer found (old UI)');
            return;
        }
        // Avoid adding duplicate timer
        if ( footer.find( '#est-session-timer' ).length ) {
            console.info('EST: initTimer: timer already exists');
            return;
        }
        // Find the Publish/Update button (primary contained)
        var button = footer.find( 'button.MuiButton-containedPrimary' ).first();
        if ( ! button.length ) {
            console.info('EST: initTimer: publish button not found');
            return;
        }
        var timerEl = $( '<span id="est-session-timer">00:00</span>' );
        console.info('EST: initTimer: creating timer element', timerEl);
        // Insert timer inside the button
        button.append( timerEl );
        console.info('EST: initTimer: appended timer inside button (fallback UI)');
        // Observe disabled/enabled state and spinner presence (fallback UI)
        ( function() {
            var spinnerVisibleFb = button.find( '.MuiCircularProgress-root' ).length > 0;
            var btnObserverFallback = new MutationObserver( function( mutations ) {
                // Handle disabled state
                mutations.forEach( function( m ) {
                    if ( m.type === 'attributes' && m.attributeName === 'disabled' ) {
                        if ( button.prop( 'disabled' ) ) {
                            console.info('EST: initTimer: fallback button disabled, stopping timer');
                            stopTimer();
                        } else {
                            console.info('EST: initTimer: fallback button enabled, starting timer');
                            startTimer( timerEl );
                        }
                    }
                } );
                // Check spinner presence transition
                var newSpinnerVisibleFb = button.find( '.MuiCircularProgress-root' ).length > 0;
                if ( newSpinnerVisibleFb && !spinnerVisibleFb ) {
                    console.info('EST: initTimer: spinner detected (fallback), hiding timer');
                    timerEl.hide();
                } else if ( !newSpinnerVisibleFb && spinnerVisibleFb ) {
                    console.info('EST: initTimer: spinner removed (fallback), showing timer');
                    timerEl.show();
                    // Move timer to end once
                    button.append( timerEl );
                    console.info('EST: initTimer: moved timer to end of button (fallback)');
                }
                spinnerVisibleFb = newSpinnerVisibleFb;
            } );
            btnObserverFallback.observe( button[0], { attributes: true, attributeFilter: [ 'disabled' ], childList: true, subtree: true } );
        } )();
        // Initial state: start or stop based on button
        if ( button.prop( 'disabled' ) ) {
            console.info('EST: initTimer: fallback button initially disabled, timer not started');
        } else {
            console.info('EST: initTimer: fallback button initially enabled, starting timer');
            startTimer( timerEl );
        }
        // Reset timer on button click (publish/update)
        button.on( 'click', function() {
            console.info('EST: fallback publish clicked, restarting timer');
            startTimer( timerEl );
        } );
    }

    var observer = new MutationObserver( function( mutations ) {
        console.info('EST: Mutation observed', mutations);
        initTimer();
    } );
    observer.observe( document.body, { childList: true, subtree: true } );

    $( window ).on( 'elementor:loaded', function() {
        console.info('EST: elementor:loaded event');
        initTimer();
    } );
    // Initial call in case editor UI is already present
    initTimer();
} )( jQuery );