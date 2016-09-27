"use strict";

( function() {

function pushDelAction( sample ) {
	gs.history.push( {
		name: "Delete",
		action: {
			func: gs.history.removeSample,
			samples: [ sample ]
		},
		undo: {
			func: gs.history.undoRemoveSample,
			samples: [ sample ]
		}
	});
}

ui.tool.delete = {
	mousedown: function( e ) {
		if ( e.target.gsSample ) {
			pushDelAction( e.target.gsSample );
			gs.samplesDelete( e.target.gsSample );
		}
	},
	mousemove: function( e ) {
		if ( e.target.gsSample ) {
			pushDelAction( e.target.gsSample );
			gs.samplesDelete( e.target.gsSample );
		}
	}
};

} )();
