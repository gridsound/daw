"use strict";

History = function() {
	this.actions = [];
	this.rip = 0;
	this.actions.push( {} );
};

History.prototype = {
	push: function( obj ) {
		if ( this.rip < this.actions.length - 1 ) {
			this.actions.splice( this.rip + 1 );
		}
		this.actions.push( obj );
		++this.rip;
	},
	undo: function() {
		if ( this.rip > 0 ) {
			var undo = this.actions[ this.rip ].undo;
			undo.func( undo );
			--this.rip;
		}
	},
	redo: function() {
		if ( this.rip < this.actions.length - 1 ) {
			var action = this.actions[ ++this.rip ].action;
			action.func( action );
		}
	},
	select: function( action ) {
		var samplesArr = action.samples,
			unselectedArr = action.removedSamples;

		if ( unselectedArr && unselectedArr.length > 0 ) {
			gs.samplesUnselect();
		}
		if ( samplesArr ) {
			samplesArr.forEach( function( s ) {
				gs.sampleSelect( s, !s.selected );
			} );
		}
	},
	undoSelect: function( undo ) {
		var samplesArr = undo.samples,
			unselectedArr = undo.removedSamples;

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
	},
	moveX: function( action ) {
		var nbTracksToMove, minTrackId = Infinity;

		gs.samplesMoveX( action.sample, action.xemDiff );
		if ( action.changeTrack ) {
			if ( action.sample.selected ) {
				nbTracksToMove = action.trackId - action.sample.track.id;
				if ( nbTracksToMove < 0 ) {
					gs.selectedSamples.forEach( function( s ) {
						minTrackId = Math.min( s.track.id, minTrackId );
					} );
					nbTracksToMove = -Math.min( minTrackId, -nbTracksToMove );
				}
				gs.selectedSamples.forEach( function( s ) {
					s.inTrack( s.track.id + nbTracksToMove );
				} );
			} else {
				action.sample.inTrack( action.trackId );
			}
		}
	},
	undoMoveX: function( undo ) {
		var nbTracksToMove, minTrackId = Infinity;

		gs.samplesMoveX( undo.sample, undo.xemDiff );
		if ( undo.changeTrack ) {
			if ( undo.sample.selected ) {
				nbTracksToMove = undo.trackId - undo.sample.track.id;
				if ( nbTracksToMove < 0 ) {
					gs.selectedSamples.forEach( function( s ) {
						minTrackId = Math.min( s.track.id, minTrackId );
					} );
					nbTracksToMove = -Math.min( minTrackId, -nbTracksToMove );
				}
				gs.selectedSamples.forEach( function( s ) {
					s.inTrack( s.track.id + nbTracksToMove );
				} );
			} else {
				undo.sample.inTrack( undo.trackId );
			}
		}
	},
	crop: function( action ) {
		gs.samplesDuration( action.sample, -action.xemDiff );
		gs.samplesMoveX( action.sample, action.xemDiff );
		gs.samplesSlip( action.sample, -action.xemDiff );

	},
	undoCrop: function( undo ) {
		gs.samplesDuration( undo.sample, -undo.xemDiff );
		gs.samplesMoveX( undo.sample, undo.xemDiff );
		gs.samplesSlip( undo.sample, -undo.xemDiff );

	},
	endCrop: function( action ) {
		gs.samplesDuration( action.sample, -action.durationDiff );

	},
	undoEndCrop: function( undo ) {
		gs.samplesDuration( undo.sample, -undo.durationDiff );


	}
};
