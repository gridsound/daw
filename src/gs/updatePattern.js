"use strict";

gs.updatePattern = function( id, dataChange ) {
	if ( "name" in dataChange ) {
		ui.assets.name( id, dataChange.name )
		if ( id === gs.currCmp.patternOpened ) {
			ui.gridKeys.updateName( dataChange.name );
		}
	}
};
