"use strict";

function sameArray( arr1, arr2 ) {
	var i;
	if ( !arr1 || !arr2 ||
		arr1.length != arr2.length ) {
		return false;
	}
	for ( i = arr1.length - 1; i >= 0; i-- ) {
		if ( arr1[ i ] !== arr2[ i ] ) {
			return false;
		}
	}
	return true;
}

( function() {

ui.tool.select = {
	mousedown: function( e ) {
		var sample = e.target.gsSample;

		if ( !e.shiftKey ) {
			unselected = gs.selectedSamples;
			gs.samplesUnselect();
		}
		if ( sample ) {
			gs.sampleSelect( sample, !sample.selected );
			selected.push( sample );
		}

		ax = e.pageX;
		ay = e.pageY;
		clicked = true;
	},
	mouseup: function() {
		clicked = dragging = false;
		wisdom.css( elRect, "width", "0px" );
		wisdom.css( elRect, "height", "0px" );
		elRect.remove();

		if ( !sameArray( gs.selectedSamples, oldSelection ) ) {
			gs.history.push( {
				action: {
					func: gs.history.select,
					samples: selected.length ? selected : null,
					removedSamples: unselected
				},
				undo: {
					func: gs.history.undoSelect,
					samples: unselected,
					removedSamples: selected.length ? selected : null
				}
			} );
			oldSelection = gs.selectedSamples.slice();
		}
		unselected = null;
		selected = [];
	},
	mousemove: function( e ) {
		if ( clicked ) {
			var btrackId, bsec,
				px = e.pageX,
				py = e.pageY;

			if ( !dragging && Math.max( Math.abs( px - ax ), Math.abs( py - ay ) ) > 5 ) {
				++selectionId;
				dragging = true;
				atrackId = ui.getTrackFromPageY( ay ).id;
				asec = ui.getGridSec( ax );
				ui.elTrackLines.appendChild( elRect );
			}

			// TODO: optimize this part :
			if ( dragging ) {
				btrackId = ui.getTrackFromPageY( py );
				btrackId = btrackId ? btrackId.id : 0;
				bsec = Math.max( 0, ui.getGridSec( px ) );
				var trackMin = Math.min( atrackId, btrackId ),
					trackMax = Math.max( atrackId, btrackId ),
					secMin = Math.min( asec, bsec ),
					secMax = Math.max( asec, bsec );

				gs.samples.forEach( function( s ) {
					if ( s.wsample ) {
						var secA, secB, trackId = s.track.id;

						if ( trackMin <= trackId && trackId <= trackMax ) {
							secA = s.wsample.when;
							secB = secA + s.wsample.duration;
							if ( ( secMin <= secA && secA < secMax ) ||
								( secMin < secB && secB <= secMax ) ||
								( secA <= secMin && secMax <= secB ) )
							{
								if ( !s.selected ) {
									s.squareSelected = selectionId;
									gs.sampleSelect( s, true );
									selected.push( s );
								}
								return;
							}
						}
						if ( s.squareSelected === selectionId ) {
							gs.sampleSelect( s, false );
							selected.push( s );
						}
					}
				} );
				wisdom.css( elRect, "top", trackMin + "em" );
				wisdom.css( elRect, "left", secMin * ui.BPMem + "em" );
				wisdom.css( elRect, "width", ( secMax - secMin ) * ui.BPMem + "em" );
				wisdom.css( elRect, "height", trackMax - trackMin + 1 + "em" );
			}
		}
	}
};

var ax, ay, atrackId, asec,
	clicked,
	dragging,
	oldSelection,
	selected = [],
	unselected = null,
	selectionId = 0,
	elRect = wisdom.cE( "<div id='squareSelection'>" )[ 0 ];

} )();
