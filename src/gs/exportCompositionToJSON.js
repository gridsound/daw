"use strict";

gs.exportCompositionToJSON = cmp => {
	const delTabs = {
			keys: 4,
			synths: 5,
			tracks: 3,
			blocks: 3,
			patterns: 3,
		},
		reg = /^\t"(\w*)": {$/,
		cmpClean = gs.epureComposition( JSON.parse( JSON.stringify( cmp ) ) ),
		lines = JSON.stringify( cmpClean, null, "\t" ).split( "\n" );
	let regTab,
		regTa2,
		delTabCurr;

	gs._blobDL && URL.revokeObjectURL( gs._blobDL );
	lines.forEach( ( line, i ) => {
		const res = reg.exec( line );

		if ( res ) {
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
