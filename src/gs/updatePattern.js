"use strict";

gs.updatePattern = function( id, dataChange ) {
	if ( "name" in dataChange ) {
		ui.patterns.name( id, dataChange.name )
		if ( id === gs.currCmp.patternOpened ) {
			ui.pattern.name( dataChange.name );
		}
	}
};
