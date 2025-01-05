"use strict";

document.addEventListener( "gsuiEvents", ( { detail: d } ) => {
	console.warn( `uncatched gsuiEvent: [${ d.component }][${ d.eventName }]`, d.args );
} );

new Promise( resolve => {
	const el = document.querySelector( "#splashScreen" );
	const elTitle = document.querySelector( "#splashScreen-title" );
	const elStart = document.querySelector( "#splashScreen-start" );
	const elForm = document.querySelector( "#splashScreen-form" );
	const elCookies = document.querySelector( "[name='cookies']" );

	GSUsetAttribute( elTitle, "texts", [
		"GridSound",
		"gRIDsOUND",
		"&<:]$+\\#)",
		"6/1)20^?}",
		"9-!>5θnu]",
	].join( " " ) );
	el.classList.add( "loaded" );
	if ( window.CSS && CSS.supports( "clip-path: inset(0 1px 2px 3px)" ) ) {
		GSUsetAttribute( elTitle, "enable", true );
	}
	elCookies.checked = localStorage.getItem( "cookieAccepted" ) === "1";
	elForm.onchange = () => {
		elStart.disabled = !elCookies.checked;
	};
	elStart.onclick = () => {
		GSUsetAttribute( elTitle, "enable", false );
		el.classList.add( "starting" );
		localStorage.setItem( "cookieAccepted", "1" );
		setTimeout( resolve, 100 );
	};
	elForm.onchange();
} )
	.then( () => GSUloadJSFile( "assets/gswaPeriodicWavesList-v1.js" ) )
	.then( () => GSUloadJSFile( "assets/gsuiLibrarySamples-v1.js" ) )
	.then( () => {
		const daw = new GSDAW();

		GSUsetAttribute( daw.rootElement, "version", document.querySelector( "#splashScreen-version" ).textContent );
		// daw.getDAWCore().$newComposition(); // better commented but it would be great to know why something doesnt work with it.
	} )
	.then( () => {
		const el = document.querySelector( "#splashScreen" );

		el.classList.add( "started" );
		setTimeout( () => el.remove(), 800 );
	} );
