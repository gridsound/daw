"use strict";

( function() {

var ax, ay, atrackId, axem,
	clicked,
	dragging,
	selectionId = 0,
	jqRect = $( "<div id='squareSelection'>" );

ui.tool.select = {
	mousedown: function( e, sample ) {
		clicked = true;
		ax = e.pageX;
		ay = e.pageY;
		if ( !e.shiftKey ) {
			gs.samplesUnselect();
		}
		if ( sample ) {
			gs.sampleSelect( sample, !sample.selected );
		}
	},
	mouseup: function() {
		clicked =
		dragging = false;
		ui.css( jqRect[ 0 ], "width", "0px" );
		ui.css( jqRect[ 0 ], "height", "0px" );
		jqRect.detach();
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
				jqRect.appendTo( ui.jqTrackLines );
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
				ui.css( jqRect[ 0 ], "top", trackMin + "em" );
				ui.css( jqRect[ 0 ], "left", xemMin + "em" );
				ui.css( jqRect[ 0 ], "width", xemMax - xemMin + "em" );
				ui.css( jqRect[ 0 ], "height", trackMax - trackMin + 1 + "em" );
			}
		}
	}
};

} )();
