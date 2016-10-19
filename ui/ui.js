"use strict";

( function() {

var initFns = [];

window.ui = {
	dom: {},

	initElement: function( name, fn ) {
		initFns.push( { name: name, fn: fn } );
		return ui;
	},

	init: function( app, tplApp, obj ) {
		var k, tpl = Handlebars.templates;

		// HTML creation :
		for ( k in tpl ) {
			if ( k !== tplApp ) {
				Handlebars.registerPartial( k, tpl[ k ] );
			}
		}
		app.innerHTML = tpl[ tplApp ]( obj );

		// Remove all the white spaces of the DOM :
		( function removeWhiteSpaces( el ) {
			var save, n = el.firstChild;

			while ( n !== null ) {
				removeWhiteSpaces( save = n );
				n = n.nextSibling;
				if ( save.nodeType !== 1 && /^\s*$/.test( save.textContent ) ) {
					el.removeChild( save );
				}
			}
		} )( app );

		// Extract all the nodes with an #Id :
		getElem( app );
		Array.from( app.querySelectorAll( "[id]" ) ).forEach( getElem );
		function getElem( el ) {
			if ( el.id ) {
				ui.dom[ el.id ] = el;
			}
		}

		// Call each init functions :
		initFns.forEach( function( v ) {
			ui[ v.name ] = v.fn( ui.dom[ v.name ] );
		} );
	},
};

} )();
