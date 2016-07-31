"use strict";

History = function() {
	this.actions = [];
	this.rip = 0;

	this.actions.push({});
};

History.prototype = {
	add: function( obj ) {
		if ( this.rip < this.actions.length - 1 ) {
			this.actions.splice( this.rip + 1 );
		}
		this.actions.push( obj );
		this.rip++;
	},
	undo: function() {
		if ( this.rip > 0 ) {
			var undo = this.actions[ this.rip ].undo;
			undo.func( undo.samples, undo.removedSamples );
			this.rip--;
		}
	},
	redo: function() {
		if ( this.rip < this.actions.length - 1 ) {
			var action = this.actions[ ++this.rip ].action;
			action.func( action.samples, action.removedSamples );
		}
	},
	select: function( samplesArr, unselectedArr ) {
		if ( unselectedArr && unselectedArr.length > 0 ) {
			gs.samplesUnselect();
		}
		if ( samplesArr ) {
			samplesArr.forEach( function( s ) {
				gs.sampleSelect( s, !s.selected );
			} );
		}
	},
	undoSelect: function( samplesArr, unselectedArr ) {
		if ( samplesArr && samplesArr.length > 0 ) {
			gs.samplesUnselect();
			samplesArr.forEach( function( s ) {
				gs.sampleSelect( s, !s.selected );
			} );
		} else if ( unselectedArr ) {
			unselectedArr.forEach( function( s ) {
				gs.sampleSelect( s, !s.selected );
			} );
		}
	}
};
