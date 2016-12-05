"use strict";

ui.initElement( "save", function( el ) {
	var elCmps = {},
		elList = el.querySelector( ".list" );

	return {
		mousedown: function( e ) {
			e.stopPropagation();
		},
		click: function( e ) {
			var el = e.target;

			if ( el.classList.contains( "save" ) ) {
				gs.compositions.save( gs.compositions.current );
			}
		},
		addComposition: function( cmp ) {
			var elCmp = wisdom.cE( Handlebars.templates.saveComposition() )[ 0 ];

			elCmp.onclick = function() {
				gs.reset();
				gs.compositions.load( cmp );
				return false;
			};
			elCmps[ cmp.id ] = {
				name: elCmp.querySelector( ".name" ),
				bpm: elCmp.querySelector( ".bpm" ),
				duration: elCmp.querySelector( ".duration" )
			};
			ui.save.updateComposition( cmp );
			elList.appendChild( elCmp );
		},
		updateComposition: function( cmp ) {
			var el = elCmps[ cmp.id ],
				dur = common.timestampText( cmp.duration );

			el.name.textContent = cmp.name;
			el.bpm.textContent = cmp.bpm;
			el.duration.textContent = dur.a + ":" + dur.b + "." + dur.c;
		}
	};
} );
