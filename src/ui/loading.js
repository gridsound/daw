"use strict";

function UIloading() {
	return new Promise( resolve => {
		const el = document.querySelector( "#loading" ),
			elTitle = document.querySelector( "#gsTitle" ),
			glitch = new TextGlitch( elTitle );

		el.classList.add( "loaded" );
		if ( window.CSS && CSS.supports( "clip-path: inset(0 1px 2px 3px)" ) ) {
			glitch.on();
		}
		el.onclick = () => {
			glitch.off();
			el.classList.add( "starting" );
			setTimeout( resolve, 100 );
		};
	} );
}

function UIloaded() {
	const el = document.querySelector( "#loading" );

	el.classList.add( "started" );
	setTimeout( () => el.remove(), 800 );
}
