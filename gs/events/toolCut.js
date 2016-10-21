"use strict";

( function() {

ui.tool.cut = {
	mousedown: function( e ) {
		_smp = e.target.gsSample;
	},
	mouseup: function( e ) {
		if ( _smp ) {
			gs.samplesCut( _smp, ui.getGridSec( e.pageX ) );
		}
		_smp = null;
	}
};

var _smp;

} )();
