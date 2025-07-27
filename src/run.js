"use strict";

document.addEventListener( "gsuiEvents", ( { detail: d } ) => {
	console.warn( `uncatched gsuiEvent: [${ d.component }][${ d.eventName }]`, d.args );
} );

new Promise( resolve => {
	const el = GSUdomQS( "#splashScreen" );
	const elTitle = GSUdomQS( "#splashScreen-title" );
	const elStart = GSUdomQS( "#splashScreen-start" );
	const elFirefox = GSUdomQS( "#splashScreen-firefox" );

	GSUonFirefox
		? GSUsetStyle( elFirefox, "display", "block" )
		: elFirefox.remove();
	GSUdomSetAttr( elTitle, "texts", [
		"GridSound",
		"gRIDsOUND",
		"&<:]$+\\#)",
		"6/1)20^?}",
		"9-!>5θnu]",
	].join( " " ) );
	GSUdomAddClass( el, "loaded" );
	if ( window.CSS && CSS.supports( "clip-path: inset(0 1px 2px 3px)" ) ) {
		GSUdomSetAttr( elTitle, "enable" );
	}
	elStart.onclick = () => {
		GSUdomRmAttr( elTitle, "enable" );
		GSUdomAddClass( el, "starting" );
		GSUsetTimeout( resolve, .1 );
	};
	localStorage.removeItem( "cookieAccepted" );
} )
	.then( () => GSUloadJSFile( "assets/gswaPeriodicWavesList-v1.js" ) )
	.then( () => GSUloadJSFile( "assets/gsuiLibrarySamples-v1.js" ) )
	.then( () => {
		const daw = new GSDAW();

		GSUdomSetAttr( daw.rootElement, "version", GSUdomQS( "#splashScreen-version" ).textContent );
	} )
	.then( () => {
		const el = GSUdomQS( "#splashScreen" );

		GSUdomAddClass( el, "started" );
		GSUsetTimeout( () => el.remove(), .8 );
	} );
