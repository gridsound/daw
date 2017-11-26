"use strict";

common.smallId_i = 0;
common.smallId = function() {
	var id = "i" + common.smallId_i.toString( 16 );

	++common.smallId_i;
	return id;
};

common.smallIdRegex = /^i[\da-fA-F]+$/;
common.smallIdParse = function( id ) {
	return common.smallIdRegex.test( id )
		? parseInt( id.substr( 1 ), 16 )
		: -1;
};
