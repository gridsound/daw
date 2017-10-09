"use strict";

gs.exportCompositionToJSON = function( cmp ) {
	var that = gs.exportCompositionToJSON,
		del = '\t"keys": {',
		arr = JSON.stringify( cmp, null, "\t" ).split( del ),
		a = arr[ 0 ],
		b = arr[ 1 ];

	that.url && URL.revokeObjectURL( that.url );
	a = a.replace( /\n\t{3}/g, " " );
	a = a.replace( /\n\t{2}}/g, " }" );
	b = b.replace( /\n\t{4}/g, " " );
	b = b.replace( /\n\t{3}}/g, " }" );
	return that.url = URL.createObjectURL( new Blob( [ a + del + b ] ) );
};
