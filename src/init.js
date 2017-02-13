"use strict";

( function() {

// GLOBALs variable for the entire app
// -------------------------------------------------------------
window.waFwk = new gswaFramework();
window.common = {};
window.ui = {
	dom: {}
};
window.gs = {
	compositions: {},
	file: {},
	files: [],
	sample: {},
	samples: {
		selected: {}
	},
	selectedSamples: []
};

// Build all the HTML
// -------------------------------------------------------------
var hbKey,
	hbTpl = Handlebars.templates,
	elApp = document.querySelector( "#app" );

for ( hbKey in hbTpl ) {
	if ( hbKey !== "app" ) {
		Handlebars.registerPartial( hbKey, hbTpl[ hbKey ] );
	}
}
elApp.innerHTML = hbTpl.app();
removeWhiteSpaces( elApp );

function removeWhiteSpaces( el ) {
	var save, n = el.firstChild;

	while ( n !== null ) {
		removeWhiteSpaces( save = n );
		n = n.nextSibling;
		if ( save.nodeType !== 1 && /^\s*$/.test( save.textContent ) ) {
			el.removeChild( save );
		}
	}
}

// Get all [id] elements
// -------------------------------------------------------------
getElem( elApp );
Array.from( elApp.querySelectorAll( "[id]" ) ).forEach( getElem );

function getElem( el ) {
	if ( el.id ) {
		ui.dom[ el.id ] = el;
	}
}

} )();
