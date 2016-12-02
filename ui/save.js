"use strict";

ui.initElement( "save", function( el ) {
	var elList = el.querySelector( ".list" ),
		elLabel = el.querySelector( "label" );

	elLabel.addEventListener( "mousedown", function( e ) {
		e.stopPropagation();
	} );
	return {
		click: function( e ) {
			var el = e.target;

			if ( el.classList.contains( "save" ) ) {
				// TODO: This 3 lines will move soon.
				var attr = gs.compositions.serialize();

				el.setAttribute( "href", attr.href );
				el.setAttribute( "download", attr.download );
			} else if ( el.gsComposition ) {
				gs.compositions.load( el.gsComposition );
			}
		},
		addComposition: function( cmp ) {
			cmp.durationText = ui.timestampText( cmp.duration );
			cmp.elCmp = wisdom.cE( Handlebars.templates.saveComposition( cmp ) )[ 0 ];
			Array.from( cmp.elCmp.querySelectorAll( "*" ) ).forEach( function( el ) {
				el.gsComposition = cmp;
			} );
			elList.appendChild( cmp.elCmp );
		}
	};
} );
