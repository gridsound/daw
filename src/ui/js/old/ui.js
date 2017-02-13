"use strict";

( function() {

var initFns = [],
	events = "click mousedown mouseup mousemove change".split( " " );

Object.assign( ui, {
	initElement: function( name, fn ) {
		initFns.push( { name: name, fn: fn } );
		return ui;
	},
	createHTML: function( html ) {
		var div = document.createElement( "div" );

		div.innerHTML = html;
		return Array.from( div.children );
	},
	init: function() {
		initFns.forEach( function( v ) {
			var k, el = ui.dom[ v.name ],
				proto = v.fn( el );

			ui[ v.name ] = proto;
			for ( k in proto ) {
				if ( events.indexOf( k ) > -1 ) {
					el.addEventListener( k, proto[ k ] );
				}
			}
		} );
	}
} );

} )();
