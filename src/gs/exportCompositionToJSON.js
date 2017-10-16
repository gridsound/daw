"use strict";

gs.exportCompositionToJSON = function( cmp ) {
	var del = '\t"keys": {',
		arr = JSON.stringify( cmp, null, "\t" ).split( del ),
		a = arr[ 0 ],
		b = arr[ 1 ];

	gs._blobDL && URL.revokeObjectURL( gs._blobDL );
	a = a.replace( /\n\t{3}/g, " " );
	a = a.replace( /\n\t{2}}/g, " }" );
	b = b.replace( /\n\t{4}/g, " " );
	b = b.replace( /\n\t{3}}/g, " }" );
	return gs._blobDL = URL.createObjectURL( new Blob( [ a + del + b ] ) );
};
