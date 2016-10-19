"use strict";

ui.initElement( "timelineBeats", function( el ) {
	var nbNums = 0;

	return {
		fill: function( nb ) {
			if ( nb > nbNums ) {
				var i = nbNums;

				nbNums = nb;
				while ( i++ < nb ) {
					el.appendChild( wisdom.cE( Handlebars.templates.timelineBeat() )[ 0 ] );
				}
			}
		}
	};
} );
