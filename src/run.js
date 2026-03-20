"use strict";

document.addEventListener( "gsui", ( { detail: d } ) => console.warn( `uncatched event: "${ d.$event }"`, d.$args, d.$target ) );

new Promise( resolve => {
	const el = $( "#splashScreen" );
	const elTitle = $( "#splashScreen-title" );
	const elStart = $( "#splashScreen-start" );
	const elFirefox = $( "#splashScreen-firefox" );

	GSUonFirefox
		? elFirefox.$css( "display", "block" )
		: elFirefox.$remove();
	el.$addAttr( "data-loaded" );
	$( "#splashScreen-logo" ).$addAttr( "data-ready" );
	if ( window.CSS && CSS.supports( "clip-path: inset(0 1px 2px 3px)" ) ) {
		elTitle.$addAttr( "enable" );
	}
	elStart.$on( "click", () => {
		elTitle.$rmAttr( "enable" );
		el.$addAttr( "data-starting" );
		GSUsetTimeout( resolve, .1 );
	} ).$rmAttr( "disabled" );
	localStorage.removeItem( "cookieAccepted" );
} )
	.then( () => GSUloadJSFile( "assets/gsuiLibrarySamples-v1.js" ) )
	.then( () => GSUloadJSFile( "assets/gsuiWaveletList-v1.js" ) )
	.then( () => {
		const daw = new GSDAW();
		const el = $( "#splashScreen" );

		// window.$daw = daw.getDAWCore();
		el.$addAttr( "data-started" );
		GSUsetTimeout( () => el.$remove(), .8 );
	} );
