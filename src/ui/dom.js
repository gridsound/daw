"use strict";

function UIdomInit() {
	const DOM = {},
		uipanels = new gsuiPanels( document.querySelector( "#app" ) );

	uipanels.attached();
	document.querySelectorAll( "div[data-panel]" ).forEach( pan => {
		const div = document.getElementById( pan.dataset.panel );

		div && div.append.apply( div, pan.children );
	} );
	document.querySelectorAll( "[id]" ).forEach( el => {
		DOM[ el.id ] = el;
		if ( "remove" in el.dataset ) {
			el.remove();
			el.removeAttribute( "data-remove" );
		}
		if ( "removeId" in el.dataset ) {
			el.removeAttribute( "id" );
			el.removeAttribute( "data-remove-id" );
		}
	} );
	DOM.versionNumber.textContent = window.VERSION;
	DOM[ "pan-rightside" ].onresizing = () => {
		UIpatternroll.resized();
		UIpianoroll.resized();
	};
	DOM[ "pan-pianoroll" ].onresizing = () => {
		UIpianoroll.resized();
	};
	window.onresize = () => {
		DOM[ "pan-rightside" ].onresizing();
	};
	window.DOM = DOM;
}
