"use strict";

function UIloading() {
	return new Promise( resolve => {
		const el = document.querySelector( "#loading" );

		el.classList.add( "loaded" );
		el.onclick = () => {
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
