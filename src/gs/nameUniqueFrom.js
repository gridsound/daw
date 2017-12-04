"use strict";

gs.nameUniqueFrom = function( name, group ) {
	return common.nameUnique( name,
		Object.values( gs.currCmp[ group ] ).map( obj => obj.name ) );
};
