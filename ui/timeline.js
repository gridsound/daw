"use strict";

ui.initElement( "timeline", function( el ) {
	var beatFirst,
		nbNums = 0;

	function createNb( nb ) {
		if ( nb > nbNums ) {
			var beat, i = nbNums;

			nbNums = nb;
			while ( i++ < nb ) {
				beat = wisdom.cE( Handlebars.templates.timelineBeat() )[ 0 ];
				ui.dom.timeline.appendChild( beat );
				beatFirst = beatFirst || beat;
			}
		}
	}

	return {
		update: function() {
			var leftEm = ui.trackLinesLeft / ui.gridEm,
				widthEm = ui.trackLinesWidth / ui.gridEm;

			createNb( Math.ceil( -leftEm + widthEm ) );
			wisdom.css( beatFirst, "marginLeft", leftEm + "em" );
			wisdom.css( ui.dom.currentTimeArrow, "marginLeft", leftEm + "em" );
			wisdom.css( ui.dom.timelineLoop, "marginLeft", leftEm + "em" );
		}
	};
} );
