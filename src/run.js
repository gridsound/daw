"use strict";

document.addEventListener( "gsui", ( { detail: d } ) => console.warn( `uncatched event: "${ d.$event }"`, d.$args, d.$target ) );

new Promise( resolve => {
	const el = GSUdomQS( "#splashScreen" );
	const elTitle = GSUdomQS( "#splashScreen-title" );
	const elStart = GSUdomQS( "#splashScreen-start" );
	const elFirefox = GSUdomQS( "#splashScreen-firefox" );

	GSUonFirefox
		? GSUdomStyle( elFirefox, "display", "block" )
		: elFirefox.remove();
	GSUdomSetAttr( el, "data-loaded" );
	GSUdomSetAttr( GSUdomQS( "#splashScreen-logo" ), "data-ready" );
	if ( window.CSS && CSS.supports( "clip-path: inset(0 1px 2px 3px)" ) ) {
		GSUdomSetAttr( elTitle, "enable" );
	}
	elStart.onclick = () => {
		GSUdomRmAttr( elTitle, "enable" );
		GSUdomSetAttr( el, "data-starting" );
		GSUsetTimeout( resolve, .1 );
	};
	localStorage.removeItem( "cookieAccepted" );
	GSUdomRmAttr( elStart, "disabled" );
} )
	.then( () => GSUloadJSFile( "assets/gswaPeriodicWavesList-v1.js" ) )
	.then( () => GSUloadJSFile( "assets/gsuiLibrarySamples-v1.js" ) )
	.then( () => {
		const daw = new GSDAW();
		const el = GSUdomQS( "#splashScreen" );

		// window.$daw = daw.getDAWCore();
		GSUdomSetAttr( el, "data-started" );
		GSUsetTimeout( () => el.remove(), .8 );
	} );
