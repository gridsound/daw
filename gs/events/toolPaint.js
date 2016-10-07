"use strict";

( function() {

ui.tool.paint = {
	mousedown: function( e ) {
		var sample = e.target.gsSample;

		if ( !sample && gs.selectedSamples.length ) {
			pushAction( null, gs.selectedSamples.slice() );
			gs.samplesUnselect();
		} else if ( sample ) {
			_trackId = sample.track.id;
			_when = sample.wsample.when;
			_offset = sample.wsample.offset;
			_duration = sample.wsample.duration;
			croppingStart = e.target.classList.contains( "start" );
			cropping = croppingStart || e.target.classList.contains( "end" );
			if ( cropping ) {
				actionName = croppingStart ? "crop" : "cropEnd";
				sample[ croppingStart ? "elCropStart" : "elCropEnd" ].classList.add( "hover" );
			} else {
				actionName = "move";
			}
			_sample = sample;
			ui.cursor( "app", !cropping ? "grabbing" :
				croppingStart ? "w-resize" : "e-resize" );
		}
	},
	mouseup: function() {
		if ( _sample ) {
			gs.samplesForEach( _sample, function( s ) {
				wa.composition.update( s.wsample, "mv" );
			} );
			if ( cropping ) {
				_sample[ croppingStart ? "elCropStart" : "elCropEnd" ].classList.remove( "hover" );
				cropping = croppingStart = false;
			}
			if ( _sample.track.id !== _trackId ||
				 _sample.wsample.when !== _when ||
				 _sample.wsample.offset !== _offset ||
				 _sample.wsample.duration !== _duration
			) {
				gs.history.push( actionName, {
						sample: _sample,
						trackId: _sample.track.id,
						changeTrack: _sample.track.id !== _trackId,
						when: _sample.wsample.when - _when,
						offset: _sample.wsample.offset - _offset,
						duration: _duration - _sample.wsample.duration,
					}, {
						sample: _sample,
						trackId: _trackId,
						changeTrack: _sample.track.id !== _trackId,
						when: _when - _sample.wsample.when,
						offset: _offset - _sample.wsample.offset,
						duration: _sample.wsample.duration - _duration,
				} );
			}
			_sample =
			_trackId =
			_when =
			_offset =
			_duration = null;
			ui.cursor( "app", null );
		}
	},
	mousemove: function( e, secRel ) {
		if ( _sample ) {
			// Changes tracks:
			if ( !cropping ) {
				e = e.target;
				var nbTracksToMove, minTrackId = Infinity,
					track = e.uitrack || e.gsSample && e.gsSample.track;
				if ( track ) {
					if ( _sample.selected ) {
						nbTracksToMove = track.id - _sample.track.id;
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
						_sample.inTrack( track.id );
					}
				}
			}
			return cropping
				? croppingStart
					? gs.samplesCropStart( _sample, secRel )
					: gs.samplesCropEnd( _sample, secRel )
				: gs.samplesWhen( _sample, secRel );
		}
	}
};

var _sample,
	_trackId,
	_when,
	_offset,
	_duration,
	cropping,
	croppingStart,
	actionName;

} )();
