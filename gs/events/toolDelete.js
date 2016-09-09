"use strict";

( function() {

function pushDelAction( sample ) {
	gs.history.push( {
		action: {
			func: gs.history.removeSample,
			samples: [ sample ]
		},
		undo: {
			func: gs.history.undoRemoveSample,
			samples: [ sample ]
		}
	} );
}

ui.tool.delete = {
	mousedown: function( e, sample ) {
		if ( sample ) {
			pushDelAction( sample );
			gs.samplesDelete( sample );
		}
	},
	mousemove: function( e, sample ) {
		if ( sample ) {
			pushDelAction( sample );
			gs.samplesDelete( sample );
		}
	}
};

} )();
