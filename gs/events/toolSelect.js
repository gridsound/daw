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

var ax, ay, atrackId, axem,
	clicked,
	dragging,
	oldSelection,
	selected = [],
	selectionId = 0,
	unselected = null,
	elRect = wisdom.cE( "<div id='squareSelection'>" )[ 0 ];

ui.tool.select = {
	mousedown: function( e, sample ) {
		clicked = true;
		ax = e.pageX;
		ay = e.pageY;
		if ( !e.shiftKey ) {
			unselected = gs.selectedSamples;
			gs.samplesUnselect();
		}
		if ( sample ) {
			gs.sampleSelect( sample, !sample.selected );
			selected.push( sample );
		}

	},
	mouseup: function() {
		clicked = dragging = false;
		wisdom.css( elRect, "width", "0px" );
		wisdom.css( elRect, "height", "0px" );
		elRect.remove();

		if ( !sameArray( gs.selectedSamples, oldSelection ) ) {
			gs.history.add( {
				action: { func: gs.history.select, samples: selected.length > 0 ? selected : null, removedSamples: unselected },
				undo: { func: gs.history.undoSelect, samples: unselected, removedSamples: selected.length > 0 ? selected : null }
			} );
			oldSelection = gs.selectedSamples.slice();
		}
		unselected = null;
		selected = [];
	},
	mousemove: function( e ) {
		if ( clicked ) {
			var btrackId, bxem,
				px = e.pageX,
				py = e.pageY;

			if ( !dragging && Math.max( Math.abs( px - ax ), Math.abs( py - ay ) ) > 5 ) {
				++selectionId;
				dragging = true;
				atrackId = ui.getTrackFromPageY( ay ).id;
				axem = ui.getGridXem( ax );
				ui.elTrackLines.appendChild( elRect );
			}

			if ( dragging ) {
				btrackId = ui.getTrackFromPageY( py );
				btrackId = btrackId ? btrackId.id : 0;
				bxem = Math.max( 0, ui.getGridXem( px ) );
				var trackMin = Math.min( atrackId, btrackId ),
					trackMax = Math.max( atrackId, btrackId ),
					xemMin = Math.min( axem, bxem ),
					xemMax = Math.max( axem, bxem );

				gs.samples.forEach( function( s ) {
					var xemA, xemB, trackId = s.track.id;
					if ( s.wsample ) { // check wsample for empty sample
						if ( trackMin <= trackId && trackId <= trackMax ) {
							xemA = s.xem;
							xemB = xemA + s.wsample.duration * ui.BPMem;
							if ( ( xemMin <= xemA && xemA < xemMax ) ||
								( xemMin < xemB && xemB <= xemMax ) ||
								( xemA <= xemMin && xemMax <= xemB ) )
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
				});
				wisdom.css( elRect, "top", trackMin + "em" );
				wisdom.css( elRect, "left", xemMin + "em" );
				wisdom.css( elRect, "width", xemMax - xemMin + "em" );
				wisdom.css( elRect, "height", trackMax - trackMin + 1 + "em" );
			}
		}
	}
};

} )();
