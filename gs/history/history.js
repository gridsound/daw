"use strict";

( function() {

gs.history = {
	push: function( obj ) {
		if ( rip < actions.length - 1 ) {
			actions.splice( rip + 1 );
		}
		actions.push( obj );
		ui.historyPush( obj );
		++rip;
	},
	undo: function() {
		if ( rip > 0 ) {
			var undo = actions[ rip ].undo;
			if ( undo.func ) {
				undo.func( undo );
			}
			--rip;
			ui.historyGo( -1 );
		}
	},
	redo: function() {
		if ( rip < actions.length - 1 ) {
			var action = actions[ ++rip ].action;
			if ( action.func ) {
				action.func( action );
			}
			ui.historyGo( +1 );
		}
	}
};

var actions = [ {} ],
	rip = 0;

} )();
