"use strict";

( function() {

ui.tool.slip = {
	mousedown: function( e ) {
		_smp = e.target.gsSample;
		if ( _smp ) {
			_offset = _smp.offset;
		}
	},
	mouseup: function() {
		if ( _smp ) {
			gs.history.push( "slip", {
				sample: _smp,
				offset: _offset - _smp.offset,
			} );
			gs.samples.selected.do( _smp, function( smp ) {
				wa.composition.update( smp, "mv" );
			} );
		}
		_smp = null;
	},
	mousemove: function( e, secRel ) {
		if ( _smp ) {
			return gs.samplesSlip( _smp, secRel );
		}
	}
};

var	_smp,
	_offset;

} )();
