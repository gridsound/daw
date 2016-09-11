"use strict";

( function() {

gs.history = {
	push: function( obj ) {
		if ( rip < actions.length - 1 ) {
			actions.splice( rip + 1 );
		}
		actions.push( obj );
		++rip;
	},
	undo: function() {
		if ( rip > 0 ) {
			var undo = actions[ rip ].undo;
			if ( undo.func ) {
				undo.func( undo );
			}
			--rip;
		}
	},
	redo: function() {
		if ( rip < actions.length - 1 ) {
			var action = actions[ ++rip ].action;
			if ( action.func ) {
				action.func( action );
			}
		}
	}
};

var actions = [ {} ],
	rip = 0;

} )();
