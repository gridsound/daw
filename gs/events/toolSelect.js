"use strict";

( function() {

ui.tool.select = {
	mousedown: function( e ) {
		var sample = e.target.gsSample;

		selected = [];
		if ( e.shiftKey ) {
			if ( !!sample ) {
				selected.push( sample );
				gs.sampleSelect( sample, !sample.selected );
			}
		} else {
			gs.selectedSamples.forEach( function( s ) {
				if ( s !== sample ) {
					selected.push( s );
				}
			} );
			gs.samplesUnselect();
			gs.sampleSelect( sample, true );
		}
		ax = e.pageX;
		ay = e.pageY;
		clicked = true;
	},
	mouseup: function( e ) {
		if ( selected && selected.length ) {
			gs.history.push( "select", { samples: selected } );
			selected = null;
		}
		clicked = dragging = false;
		wisdom.css( elRect, "width", "0px" );
		wisdom.css( elRect, "height", "0px" );
		elRect.remove();
	},
	mousemove: function( e ) {
		if ( clicked ) {
			var px = e.pageX,
				py = e.pageY;

			if ( !dragging && Math.max( Math.abs( px - ax ), Math.abs( py - ay ) ) > 5 ) {
				++selectionId;
				dragging = true;
				atrackId = ui.getTrackFromPageY( ay ).id;
				asec = ui.getGridSec( ax );
				ui.elTrackLines.appendChild( elRect );
			}

			// TODO: optimize this part:
			if ( dragging ) {
				var track = ui.getTrackFromPageY( py ),
					btrackId = track ? track.id : 0,
					trackMin = Math.min( atrackId, btrackId ),
					trackMax = Math.max( atrackId, btrackId ),
					bsec = Math.max( 0, ui.getGridSec( px ) ),
					secMin = Math.min( asec, bsec ),
					secMax = Math.max( asec, bsec );

				gs.samples.forEach( function( s ) {
					if ( s.wsample ) {
						if ( trackMin <= s.track.id && s.track.id <= trackMax ) {
							var secA = s.wsample.when,
								secB = s.wsample.duration + secA;

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
							delete s.squareSelected;
							gs.sampleSelect( s, false );
							selected.splice( selected.indexOf( s ), 1 );
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
	selected,
	selectionId = 0,
	elRect = wisdom.cE( "<div id='squareSelection'>" )[ 0 ];

} )();
