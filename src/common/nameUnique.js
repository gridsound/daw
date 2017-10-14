"use strict";

common.nameUnique = function( name, arr ) {
	var reg, res, nb;

	name = common.trim2( name );
	if ( arr.indexOf( name ) > -1 ) {
		if ( /\(\d+\)$/.test( name ) ) {
			name = name.substr( 0, name.lastIndexOf( "(" ) ).trim();
		}
		reg = new RegExp( "^" + name + " \\((\\d+)\\)$" );
		nb = arr.reduce( function( nb, str ) {
			res = reg.exec( str );
			return res ? Math.max( nb, +res[ 1 ] ) : nb;
		}, 1 );
		return `${ name } (${ nb + 1 })`;
	}
	return name;
};
