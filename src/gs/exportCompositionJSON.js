"use strict";

gs.exportCompositionJSON = function( id ) {
	var cmp = id === gs.currCmp.id ? gs.currCmp : gs.localStorage.get( id ),
		blob = new Blob( [ JSON.stringify( cmp, null, '\t' ) ] );

	ui.downloadBlob( ( cmp.name || "untitled" ) + ".gs", blob );
};
