"use strict";

( function() {

ui.tool.select = {
	mousedown: function( e ) {
		var smp = e.target.gsSample;

		selected = [];
		if ( e.shiftKey ) {
			if ( !!smp ) {
				selected.push( smp );
				gs.sample.select( smp );
			}
		} else {
			gs.selectedSamples.forEach( function( s ) {
				if ( s !== smp ) {
					selected.push( s );
				}
			} );
			gs.samples.selected.unselect();
			gs.sample.select( smp, true );
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
		elRect.style.width =
		elRect.style.height = "0px";
		elRect.remove();
	},
	mousemove: function( e ) {
		if ( clicked ) {
			var px = e.pageX,
				py = e.pageY;

			if ( !dragging && Math.max( Math.abs( px - ax ), Math.abs( py - ay ) ) > 5 ) {
				++selectionId;
				dragging = true;
				atrackId = ui.gridGetTrackByPageY( ay ).id;
				asec = ui.gridGetWhen( ax );
				ui.dom.tracksLines.appendChild( elRect );
			}

			// TODO: optimize this part:
			if ( dragging ) {
				var track = ui.gridGetTrackByPageY( py ),
					btrackId = track ? track.id : 0,
					trackMin = Math.min( atrackId, btrackId ),
					trackMax = Math.max( atrackId, btrackId ),
					bsec = Math.max( 0, ui.gridGetWhen( px ) ),
					secMin = Math.min( asec, bsec ),
					secMax = Math.max( asec, bsec );

				gs.composition.samples.forEach( function( smp ) {
					if ( trackMin <= smp.data.track.id && smp.data.track.id <= trackMax ) {
						var secA = smp.when,
							secB = smp.duration + secA;

						if ( ( secMin <= secA && secA < secMax ) ||
							( secMin < secB && secB <= secMax ) ||
							( secA <= secMin && secMax <= secB )
						) {
							if ( !smp.data.selected ) {
								smp.data.squareSelected = selectionId;
								gs.sample.select( smp, true );
								selected.push( smp );
							}
							return;
						}
					}
					if ( smp.data.squareSelected === selectionId ) {
						delete smp.data.squareSelected;
						gs.sample.select( smp, false );
						selected.splice( selected.indexOf( smp ), 1 );
					}
				} );
				elRect.style.left = secMin * ui.BPMem + "em";
				elRect.style.width = ( secMax - secMin ) * ui.BPMem + "em";
				elRect.style.top = trackMin * ui.trackHeight + "px";
				elRect.style.height = ( trackMax - trackMin + 1 ) * ui.trackHeight + "px";
			}
		}
	}
};

var ax, ay, atrackId, asec,
	clicked,
	dragging,
	selected,
	selectionId = 0,
	elRect = ui.createHTML( "<div id='squareSelection'>" )[ 0 ];

} )();
