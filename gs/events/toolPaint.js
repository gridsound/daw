"use strict";

( function() {

ui.tool.paint = {
	mousedown: function( e ) {
		var smp = e.target.gsSample;

		if ( !smp && gs.selectedSamples.length ) {
			gs.history.push( "select", { samples: gs.selectedSamples.slice() } );
			gs.samples.selected.unselect();
		} else if ( smp ) {
			_trackId = smp.data.track.id;
			_when = smp.when;
			_offset = smp.offset;
			_duration = smp.duration;
			croppingStart = e.target.classList.contains( "start" );
			cropping = croppingStart || e.target.classList.contains( "end" );
			if ( cropping ) {
				actionName = croppingStart ? "crop" : "cropEnd";
				smp.data[ croppingStart ? "elCropStart" : "elCropEnd" ].classList.add( "hover" );
			} else {
				actionName = "move";
			}
			_smp = smp;
			ui.cursor( "app", !cropping ? "grabbing" :
				croppingStart ? "w-resize" : "e-resize" );
		}
	},
	mouseup: function() {
		if ( _smp ) {
			gs.samples.selected.do( _smp, function( smp ) {
				wa.composition.update( smp, "mv" );
			} );
			if ( cropping ) {
				_smp.data[ croppingStart ? "elCropStart" : "elCropEnd" ].classList.remove( "hover" );
				cropping = croppingStart = false;
			}
			if ( _smp.data.track.id !== _trackId ||
				 _smp.when          !== _when    ||
				 _smp.offset        !== _offset  ||
				 _smp.duration      !== _duration
			) {
				gs.history.push( actionName, {
					sample:   _smp,
					track:    _smp.data.track.id - _trackId,
					when:     _smp.when - _when,
					offset:   _smp.offset - _offset,
					duration: _smp.duration - _duration,
				} );
			}
			_smp =
			_trackId =
			_when =
			_offset =
			_duration = null;
			ui.cursor( "app", null );
		}
	},
	mousemove: function( e, secRel ) {
		if ( _smp ) {
			// Changes tracks:
			if ( !cropping ) {
				e = e.target;
				var nbTracksToMove, minTrackId = Infinity,
					track = e.uitrack || e.gsSample && e.gsSample.data.track;

				if ( track ) {
					if ( _smp.data.selected ) {
						nbTracksToMove = track.id - _smp.data.track.id;
						if ( nbTracksToMove < 0 ) {
							gs.selectedSamples.forEach( function( smp ) {
								minTrackId = Math.min( smp.data.track.id, minTrackId );
							} );
							nbTracksToMove = -Math.min( minTrackId, -nbTracksToMove );
						}
						gs.selectedSamples.forEach( function( smp ) {
							gs.sample.inTrack( smp, smp.data.track.id + nbTracksToMove );
						} );
					} else {
						gs.sample.inTrack( _smp, track.id );
					}
				}
			}
			return cropping
				? croppingStart
					? gs.samples.selected.cropStart( _smp, secRel )
					: gs.samples.selected.cropEnd( _smp, secRel )
				: gs.samples.selected.when( _smp, secRel );
		}
	}
};

var _smp,
	_trackId,
	_when,
	_offset,
	_duration,
	cropping,
	croppingStart,
	actionName;

} )();
