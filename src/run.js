"use strict";

document.addEventListener( "gsuiEvents", ( { detail: d } ) => {
	console.warn( `uncatched gsuiEvent: [${ d.component }][${ d.eventName }]`, d.args );
} );

new Promise( resolve => {
	const el = document.querySelector( "#splashScreen" );
	const elTitle = document.querySelector( "#splashScreen-title" );
	const glitch = new TextGlitch( elTitle );

	el.classList.add( "loaded" );
	if ( window.CSS && CSS.supports( "clip-path: inset(0 1px 2px 3px)" ) ) {
		glitch.on();
	}
	el.onclick = () => {
		glitch.off();
		el.classList.add( "starting" );
		setTimeout( resolve, 100 );
	};
} )
	.then( () => {
		const daw = new GSDAW();

		daw.getDAWCore().addCompositionsFromLocalStorage();
		daw.newComposition();
	} )
	.then( () => {
		const el = document.querySelector( "#splashScreen" );

		el.classList.add( "started" );
		setTimeout( () => el.remove(), 800 );
	} );
