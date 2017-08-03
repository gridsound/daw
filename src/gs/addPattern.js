"use strict";

gs.addPattern = function( id, data ) {
	data.name = data.name || "";
	ui.patterns.add( id, data );
};
