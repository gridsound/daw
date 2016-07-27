"use strict";

( function() {

var ax, ay, atrackId, axem,
	clicked,
	dragging,
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
			gs.history.add( { action: gs.history.select.bind( gs.history, [ sample ] , unselected ),
							  undo: gs.history.undoSelect.bind( gs.history, unselected, [ sample ] ) } );
			unselected = null;
		}

	},
	mouseup: function() {
		clicked = dragging = false;
		wisdom.css( elRect, "width", "0px" );
		wisdom.css( elRect, "height", "0px" );
		elRect.remove();
		if ( unselected ) {
			gs.history.add( { action: gs.history.select.bind( gs.history, null , unselected ),
							  undo: gs.history.undoSelect.bind( gs.history, unselected, null ) } );
			unselected = null;
		}
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
								}
								return;
							}
						}
						if ( s.squareSelected === selectionId ) {
							gs.sampleSelect( s, false );
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
