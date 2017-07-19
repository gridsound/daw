"use strict";

common.composeUndo = function( data, redo ) {
	if ( data && redo && typeof data === "object" && typeof redo === "object" ) {
		var k, undo = {};

		for ( k in redo ) {
			if ( data[ k ] !== redo[ k ] ) {
				undo[ k ] = common.composeUndo( data[ k ], redo[ k ] );
			}
		}
		return undo;
	}
	return data;
};
