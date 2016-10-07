"use strict";

// This function is temporarly in the global scope.
function pushAction( selected, unselected ) {
	gs.history.push( "select", {
		samples: selected && selected.length ? selected : null,
		removedSamples: unselected
	} );
}

( function() {

ui.tool.select = {
	mousedown: function( e ) {
		var sample = e.target.gsSample;

		oldSelection = gs.selectedSamples.slice();
		if ( !e.shiftKey ) {
			unselected = gs.selectedSamples.slice();
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
	mouseup: function( e ) {
		clicked = dragging = false;
		wisdom.css( elRect, "width", "0px" );
		wisdom.css( elRect, "height", "0px" );
		elRect.remove();

		if ( Object.keys( e ).length !== 0 &&
			!isSameArray( gs.selectedSamples, oldSelection ) ) {
			pushAction( selected, unselected );
			unselected = null;
			selected = [];
			name = "";
		}
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
	name,
	oldSelection,
	selected = [],
	selectionId = 0,
	unselected = null,
	elRect = wisdom.cE( "<div id='squareSelection'>" )[ 0 ];

} )();
