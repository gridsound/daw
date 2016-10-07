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
	push: function( actionName, redo, undo ) {
		var action = {
			id: rip,
			name: actionName,
			redo: redo,
			undo: undo,
		};

		redo.func = gs.history[ actionName ];
		undo.func = gs.history[ actionName + "_undo" ];
		if ( rip < actions.length - 1 ) {
			actions.splice( rip + 1 );
		}
		actions.push( action );
		ui.historyPush( action );
		++rip;
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
			var redo = actions[ ++rip ].redo;
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
