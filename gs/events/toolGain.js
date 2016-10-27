"use strict";

( function() {

ui.tool.gain = {
	mousedown: function( e ) {
		_smp = e.target.gsSample;
		if ( _smp ) {
			_offset = _smp.offset;
		}
	},
	mouseup: function() {
		_smp = null;
	},
	mousemove: function( e, secRel ) {
		if ( _smp ) {
			return gs.samples.selected.gain( _smp, secRel );
		}
	}
};


var	_smp,
	_offset;

} )();
