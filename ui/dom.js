"use strict";

( function() {

ui.dom = {};
ui.domInit = function( el ) {
	getElem( el );
	Array.from( el.querySelectorAll( "[id]" ) ).forEach( getElem );
};

function getElem( el ) {
	if ( el.id ) {
		ui.dom[ el.id ] = el;
	}
}

} )();
