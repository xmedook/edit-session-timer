( function( $ ) {
    // editor-session-timer loaded
    var estStartTime = null;
    var estTimerInterval = null;
    var estElapsedBeforePause = 0;
    var estPaused = false;
    var inactivityTimerId = null;
    // Inactivity timeout in seconds (default 30)
    var inactivityTimeoutSeconds = ( typeof estSettings !== 'undefined' && estSettings.inactivityTimeout ) ? parseInt( estSettings.inactivityTimeout, 10 ) : 30;
    function formatTime( ms ) {
        var totalSeconds = Math.floor( ms / 1000 );
        var minutes = Math.floor( totalSeconds / 60 );
        var seconds = totalSeconds % 60;
        return ( '0' + minutes ).slice( -2 ) + ':' + ( '0' + seconds ).slice( -2 );
    }

    // Start or resume timer, updating timerEl
    function startTimer( timerEl ) {
        clearInterval( estTimerInterval );
        estStartTime = Date.now();
        estElapsedBeforePause = 0;
        estPaused = false;
        
        estTimerInterval = setInterval( function() {
            var elapsed = Date.now() - estStartTime;
            timerEl.text( formatTime( elapsed ) );
        }, 1000 );
        
        resetInactivityTimer();
    }

    // Pause timer and preserve elapsed time
    function stopTimer() {
        clearInterval( estTimerInterval );
        estTimerInterval = null;
        estElapsedBeforePause = Date.now() - estStartTime;
        estPaused = true;
    }
    
    // Reset the inactivity timer: schedule pause after timeout of no activity
    function resetInactivityTimer() {
        clearTimeout( inactivityTimerId );
        if ( inactivityTimeoutSeconds > 0 ) {
            inactivityTimerId = setTimeout( function() {
                stopTimer();
                console.log('[EST] Timer paused due to inactivity');
            }, inactivityTimeoutSeconds * 1000 );
        }
    }

    function initTimer() {
        // Detect new Elementor v2 editor UI
        var editorWrapper = $( '#elementor-editor-wrapper-v2' );
        if ( editorWrapper.length ) {
            var pubGroup = editorWrapper.find('div[role="group"].MuiButtonGroup-root.MuiButtonGroup-contained');
            var pubButton = pubGroup.find('button.MuiButton-containedPrimary').first();
            if ( ! pubButton.length ) {
                // Intentar encontrar el botón de otra manera
                pubButton = editorWrapper.find('button.MuiButton-containedPrimary').first();
                if (!pubButton.length) {
                    return;
                }
            }
            if ( pubButton.find('#est-session-timer').length ) {
                return;
            }
            var timerEl = $( '<span id="est-session-timer">00:00</span>' );
            
            // Asegurarse de que el botón esté completamente cargado antes de agregar el timer
            setTimeout(function() {
                pubButton.append( timerEl );
            }, 100);
            
            // Un solo observador para manejar todos los cambios del botón
            ( function() {
                var spinnerVisible = pubButton.find( '.MuiCircularProgress-root' ).length > 0;
                var btnObserver = new MutationObserver( function( mutations ) {
                    mutations.forEach( function( m ) {
                        if ( m.type === 'attributes' && m.attributeName === 'disabled' ) {
                            if ( pubButton.prop( 'disabled' ) ) {
                                stopTimer();
                                timerEl.text('00:00');
                            } else if (!estTimerInterval) {
                                startTimer( timerEl );
                            }
                        }
                    } );
                    // Check spinner presence transition
                    var newSpinnerVisible = pubButton.find( '.MuiCircularProgress-root' ).length > 0;
                    if ( newSpinnerVisible && !spinnerVisible ) {
                        timerEl.hide();
                    } else if ( !newSpinnerVisible && spinnerVisible ) {
                        timerEl.show();
                        // Move timer to end once
                        pubButton.append( timerEl );
                    }
                    spinnerVisible = newSpinnerVisible;
                } );
                btnObserver.observe( pubButton[0], { attributes: true, attributeFilter: [ 'disabled' ], childList: true, subtree: true } );
            } )();

            // Initial state: start or stop timer based on button enabled state
            if ( pubButton.prop( 'disabled' ) ) {
                timerEl.text('00:00');
            } else {
                startTimer( timerEl );
            }

            // Reset timer on button click (publish/update)
            pubButton.on( 'click', function() {
                stopTimer();
                timerEl.text('00:00');
            } );
            
            // Activity listener: clicks or keypresses anywhere in the Elementor editor body reset or resume timer
            $( document ).on( 'click keydown', 'body.elementor-editor-active *', function() {
                if ( estPaused ) {
                    console.log('[EST] Timer resumed');
                    startTimer( timerEl );
                } else {
                    resetInactivityTimer();
                }
            } );
            return;
        }
        // Fallback for older Elementor editor UI
        var footer = $( '.elementor-panel-footer' );
        if ( ! footer.length ) {
            return;
        }
        // Avoid adding duplicate timer
        if ( footer.find( '#est-session-timer' ).length ) {
            return;
        }
        // Find the Publish/Update button (primary contained)
        var button = footer.find( 'button.MuiButton-containedPrimary' ).first();
            if ( ! button.length ) {
                return;
            }
        var timerEl = $( '<span id="est-session-timer">00:00</span>' );
        // timer element created
        // Insert timer inside the button
        button.append( timerEl );
        // timer appended inside fallback UI
        // Observe disabled/enabled state and spinner presence (fallback UI)
        ( function() {
            var spinnerVisibleFb = button.find( '.MuiCircularProgress-root' ).length > 0;
            var btnObserverFallback = new MutationObserver( function( mutations ) {
                // Handle disabled state
                mutations.forEach( function( m ) {
                    if ( m.type === 'attributes' && m.attributeName === 'disabled' ) {
                        if ( button.prop( 'disabled' ) ) {
                            // fallback button disabled, stopping timer
                            stopTimer();
                        } else {
                            // fallback button enabled, starting timer
                            startTimer( timerEl );
                        }
                    }
                } );
                // Check spinner presence transition
                var newSpinnerVisibleFb = button.find( '.MuiCircularProgress-root' ).length > 0;
                if ( newSpinnerVisibleFb && !spinnerVisibleFb ) {
                    // spinner detected (fallback), hiding timer
                    timerEl.hide();
                } else if ( !newSpinnerVisibleFb && spinnerVisibleFb ) {
                    // spinner removed (fallback), showing timer
                    timerEl.show();
                    // Move timer to end once
                    button.append( timerEl );
                    // moved timer to end of button (fallback)
                }
                spinnerVisibleFb = newSpinnerVisibleFb;
            } );
            btnObserverFallback.observe( button[0], { attributes: true, attributeFilter: [ 'disabled' ], childList: true, subtree: true } );
        } )();
        // Initial state: start or stop based on button
        if ( button.prop( 'disabled' ) ) {
        // fallback button initially disabled, timer not started
        } else {
        // fallback button initially enabled, starting timer
            startTimer( timerEl );
        }
        // Reset timer on button click (publish/update)
        button.on( 'click', function() {
        // fallback publish clicked, restarting timer
            startTimer( timerEl );
        } );
    }

    var observer = new MutationObserver( function( /* mutations */ ) {
        initTimer();
    } );
    observer.observe( document.body, { childList: true, subtree: true } );

    $( window ).on( 'elementor:loaded', function() {
        initTimer();
    } );
    // Initial call in case editor UI is already present
    initTimer();
} )( jQuery );