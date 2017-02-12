"use strict";

( function() {

gs.history = {
	reset: function() {
		actions.length = 0;
		rip = -1;
		ui.historyList.reset();
	},
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
	push: function( actionName, data ) {
		var action = {
				id: rip,
				name: actionName,
				fn: gs.history[ actionName ],
				data: data
			};

		if ( rip < actions.length - 1 ) {
			actions.splice( rip + 1 );
		}
		actions.push( action );
		ui.historyList.push( action );
		++rip;
	},
	pushExec: function( actionName, data ) {
		gs.history.push( actionName, data );
		gs.history[ actionName ]( data, 1 );
	},
	undo: function() {
		if ( rip > -1 ) {
			var act = actions[ rip-- ];

			if ( act.fn ) {
				act.fn( act.data, -1 );
			}
			ui.historyList.undo();
		}
	},
	redo: function() {
		if ( rip < actions.length - 1 ) {
			var act = actions[ ++rip ];

			if ( act.fn ) {
				act.fn( act.data, +1 );
			}
			ui.historyList.redo();
		}
	}
};

var rip,
	actions = [];

} )();
