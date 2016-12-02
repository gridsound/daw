"use strict";

ui.initElement( "save", function( el ) {
	var elList = el.querySelector( ".list" );

	return {
		click: function( e ) {
			var el = e.target;

			if ( el.classList.contains( "save" ) ) {
				var attr = gs.save(); // <-- this methode has to be rename in .export or something

				el.setAttribute( "href", attr.href );
				el.setAttribute( "download", attr.download );
			} else if ( el.gsComposition ) {
				// gs.load( el.gsComposition );
			}
		},
		addComposition: function( cmp ) {
			cmp._durationText = ui.timestampText( cmp.duration );
			cmp._elCmp = wisdom.cE( Handlebars.templates.saveComposition( cmp ) )[ 0 ];
			Array.from( cmp._elCmp.querySelectorAll( "*" ) ).forEach( function( el ) {
				el.gsComposition = cmp;
			} );
			elList.appendChild( cmp._elCmp );
		}
	};
} );
