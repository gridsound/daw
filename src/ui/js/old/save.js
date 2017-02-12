"use strict";

ui.initElement( "save", function( el ) {
	var elCmps = {},
		elList = el.querySelector( ".list" );

	return {
		click: function( e ) {
			var el = e.target;

			e.stopPropagation();
			if ( el.classList.contains( "save" ) ) {
				gs.compositions.saveCurrent();
			}
		},
		hideList: function() {
			ui.dom.saveCheckbox.checked = false;
		},
		unselectComposition: function() {
			var firstCmp = elList.firstChild;

			firstCmp && firstCmp.classList.remove( "selected" );
		},
		selectComposition: function( cmp ) {
			var elCmp = elCmps[ cmp.id ].root;

			ui.save.unselectComposition();
			elCmp.classList.add( "selected" );
			elList.insertBefore( elCmp, elList.firstChild );
		},
		addComposition: function( cmp ) {
			var elCmp = ui.createHTML( Handlebars.templates.saveComposition() )[ 0 ];

			elCmp.onclick = function() {
				gs.reset();
				gs.compositions.load( cmp );
				window.setTimeout( ui.save.hideList, 200 );
				return false;
			};
			elCmps[ cmp.id ] = {
				root: elCmp,
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
