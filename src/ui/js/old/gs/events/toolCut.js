"use strict";

( function() {

ui.tool.cut = {
	mousedown: function( e ) {
		_smp = e.target.gsSample;
	},
	mouseup: function( e ) {
		if ( _smp ) {
			gs.samples.selected.cut( _smp, ui.grid.getWhen( e.pageX ) );
		}
		_smp = null;
	}
};

var _smp;

} )();
