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
} );

/*
1. // 90 -> current pianoroll's pxPerBeat
*/
