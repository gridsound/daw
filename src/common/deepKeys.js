"use strict";

common.deepKeys = function( obj ) {
	return Object.keys( common.deepKeys._rec( obj, {} ) );
};

common.deepKeys._rec = function( obj, _keys ) {
	if ( obj ) {
		Object.entries( obj ).forEach( ( [ key, val ] ) => {
			_keys[ key ] = true;
			if ( typeof val === "object" ) {
				common.deepKeys._rec( val, _keys );
			}
		} );
	}
	return _keys;
};
