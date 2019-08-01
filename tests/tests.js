"use strict";

QUnit.config.reorder = false;
QUnit.config.altertitle = false;

QUnit.module( "DAW", () => {

	const qS = document.querySelector.bind( document );
	const qSA = document.querySelectorAll.bind( document );
	const clickX = ( el, type, clientX ) => {
		el.dispatchEvent( new MouseEvent( type, {
			view: window,
			bubbles: true,
			cancelable: true,
			clientX,
		} ) );
	};

	// .............................................................................................
	// .............................................................................................
	QUnit.test( "Splashscreen: click", assert => {
		const done = assert.async();

		assert.expect( 1 );
		qS( "#loading" ).click();
		setTimeout( () => {
			assert.strictEqual( qS( "#loading" ), null, "Splashscreen clicked and removed." );
			done();
		}, 3000 );
	} );

	// .............................................................................................
	// .............................................................................................
	QUnit.test( "Pianoroll: create a key", assert => {
		const el = qS( ".gsuiKey-row[ data-midi='57' ]" );
		const clientX = el.getBoundingClientRect().x + 90;
		const nbActions = qSA( ".historyAction" ).length;

		clickX( el, "mousedown", clientX );
		assert.expect( 3 );
		assert.strictEqual( document.title, "*GridSound", "document.title" );
		assert.strictEqual( DAW.get.keys( 0 )[ 1 ].when, 1, "DAW.get.keys( 0 )[ 1 ].when" );
		assert.strictEqual( qSA( ".historyAction" ).length, nbActions + 1, '$( ".historyAction" ).length' );
	} );

	// .............................................................................................
	// .............................................................................................
	QUnit.test( "Controls: clock", assert => {
		const el = qS( ".gsuiPianoroll .gsuiTimeline-currentTime" );
		const clientX = el.getBoundingClientRect().x;
		const pxPerBeat = 90;

		if ( UIclock._display === "second" ) {
			__changeClockMode();
		}
		clickX( el, "mousedown", clientX + pxPerBeat );
		clickX( el, "mouseup", clientX + pxPerBeat );
		DAW.pianorollFocus();
		assert.expect( 6 );
		assert.strictEqual( __getClockContent(), "2:01:000", "beat:2 focus:pianoroll display:beat" );
		__changeClockMode();
		assert.strictEqual( __getClockContent(), "0:00:500", "beat:2 focus:pianoroll display:second" );
		DAW.compositionFocus();
		assert.strictEqual( __getClockContent(), "0:00:000", "beat:1 focus:composition display:second" );
		__changeClockMode();
		assert.strictEqual( __getClockContent(), "1:01:000", "beat:1 focus:composition display:beat" );
		clickX( el, "mousedown", clientX + 2 * pxPerBeat );
		clickX( el, "mouseup", clientX + 2 * pxPerBeat );
		assert.strictEqual( __getClockContent(), "1:01:000", "beat:1 focus:composition display:beat" );
		DAW.pianorollFocus();
		assert.strictEqual( __getClockContent(), "3:01:000", "beat:3 focus:pianoroll display:beat" );
	} );

	// .............................................................................................
	// .............................................................................................
	function __changeClockMode() {
		qS( ".gsuiClock-modes" ).click();
	}
	function __getClockContent() {
		return qS( ".gsuiClock-absolute" ).textContent.trim().replace( /\s+/g, ":" );
	}
} );
