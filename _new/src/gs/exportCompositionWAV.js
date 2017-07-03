"use strict";

gs.exportCompositionWAV = function( id ) {
	var blob, cmp = gs.currCmp;

	if ( id !== cmp.id ) {
		alert( "You have to open a composition before render it." );
	} else {
		// ...
		// ui.downloadBlob( ( cmp.name || "untitled" ) + ".wav", blob );
	}
};
