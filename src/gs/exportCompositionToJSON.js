"use strict";

gs.exportCompositionToJSON = function( cmp ) {
	var res,
		regTab,
		regTa2,
		delTabCurr,
		delTabs = {
			tracks: 3,
			patterns: 3,
			blocks: 3,
			keys: 4,
			synths: 5
		},
		reg = /^\t"(\w*)": {$/,
		lines = JSON.stringify( cmp, null, "\t" ).split( "\n" );

	gs._blobDL && URL.revokeObjectURL( gs._blobDL );
	lines.forEach( ( line, i ) => {
		if ( res = reg.exec( line ) ) {
			if ( delTabCurr = delTabs[ res[ 1 ] ] ) {
				regTab = new RegExp( `^\\t{${ delTabCurr }}` );
				regTa2 = new RegExp( `^\\t{${ delTabCurr - 1 }}\\}` );
			}
		}
		if ( delTabCurr ) {
			lines[ i ] = lines[ i ].replace( regTab, "~" ).replace( regTa2, "~}" );
		}
	} );
	return gs._blobDL = URL.createObjectURL( new Blob( [
		lines.join( "\n" ).replace( /\n~/g, " " ) ] ) );
};
