"use strict";

document.addEventListener( "gsuiEvents", ( { detail: d } ) => {
	console.warn( `uncatched gsuiEvent: [${ d.component }][${ d.eventName }]`, d.args );
} );

new Promise( resolve => {
	const el = GSUdomQS( "#splashScreen" );
	const elTitle = GSUdomQS( "#splashScreen-title" );
	const elStart = GSUdomQS( "#splashScreen-start" );
	const elForm = GSUdomQS( "#splashScreen-form" );
	const elCookies = GSUdomQS( "[name='cookies']" );

	GSUdomSetAttr( elTitle, "texts", [
		"GridSound",
		"gRIDsOUND",
		"&<:]$+\\#)",
		"6/1)20^?}",
		"9-!>5θnu]",
	].join( " " ) );
	el.classList.add( "loaded" );
	if ( window.CSS && CSS.supports( "clip-path: inset(0 1px 2px 3px)" ) ) {
		GSUdomSetAttr( elTitle, "enable" );
	}
	elCookies.checked = localStorage.getItem( "cookieAccepted" ) === "1";
	elForm.onchange = () => {
		elStart.disabled = !elCookies.checked;
	};
	elStart.onclick = () => {
		GSUdomRmAttr( elTitle, "enable" );
		el.classList.add( "starting" );
		localStorage.setItem( "cookieAccepted", "1" );
		GSUsetTimeout( resolve, .1 );
	};
	elForm.onchange();
} )
	.then( () => GSUloadJSFile( "assets/gswaPeriodicWavesList-v1.js" ) )
	.then( () => GSUloadJSFile( "assets/gsuiLibrarySamples-v1.js" ) )
	.then( () => {
		const daw = new GSDAW();

		GSUdomSetAttr( daw.rootElement, "version", GSUdomQS( "#splashScreen-version" ).textContent );
	} )
	.then( () => {
		const el = GSUdomQS( "#splashScreen" );

		el.classList.add( "started" );
		GSUsetTimeout( () => el.remove(), .8 );
	} );
