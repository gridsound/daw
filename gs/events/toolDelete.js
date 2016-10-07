"use strict";

( function() {

function pushDelAction( sample ) {
	gs.history.push( "delete", {
			func: gs.history.removeSample,
			samples: [ sample ]
		}, {
			func: gs.history.undoRemoveSample,
			samples: [ sample ]
	} );
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
