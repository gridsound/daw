"use strict";

gs.nameUniqueFrom = ( name, group ) => (
	common.nameUnique( name,
		Object.values( gs.currCmp[ group ] ).map( o => o.name ) )
);
