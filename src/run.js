"use strict";

UIloading().then( UIrun ).then( UIloaded );

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

function UIrun() {
	const hash = new Map( location.hash
			.substr( 1 )
			.split( "&" )
			.map( kv => kv.split( "=" ) )
		);

	window.daw = new GSDAW(); // ?
	window.DAW = daw.getDAWCore(); // ?
	window.UIdaw = daw.rootElement; // ?

	// UIauthGetMe();
	DAW.addCompositionsFromLocalStorage();

	document.addEventListener( "gsuiEvents", e => {
		const { component, eventName, args } = e.detail;

		console.warn( `uncatched gsuiEvent: [${ component }][${ eventName }]`, args );
	} );

	if ( !hash.has( "cmp" ) ) {
		daw.newComposition();
	} else {
		DAW.addCompositionByURL( hash.get( "cmp" ) )
			.catch( e => {
				console.error( e );
				return DAW.addNewComposition();
			} )
			.then( cmp => DAW.openComposition( "local", cmp.id ) );
		location.hash = "";
	}
}
