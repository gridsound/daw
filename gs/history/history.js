"use strict";

( function() {

gs.history = {
	goToAction: function( action ) {
		var n = action.id - rip + 1;
		if ( n < 0 ) {
			while ( n++ ) {
				gs.history.undo();
			}
		} else if ( n > 0 ) {
			while ( n-- ) {
				gs.history.redo();
			}
		}
	},
	push: function( action ) {
		if ( rip < actions.length - 1 ) {
			actions.splice( rip + 1 );
		}
		action.id = rip++;
		actions.push( action );
		ui.historyPush( action );
	},
	undo: function() {
		if ( rip > 0 ) {
			var undo = actions[ rip-- ].undo;
			if ( undo.func ) {
				undo.func( undo );
			}
			ui.historyUndo();
		}
	},
	redo: function() {
		if ( rip < actions.length - 1 ) {
			var redo = actions[ ++rip ].action;
			if ( redo.func ) {
				redo.func( redo );
			}
			ui.historyRedo();
		}
	}
};

var actions = [ {} ],
	rip = 0;

} )();
