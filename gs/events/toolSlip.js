"use strict";

( function() {

ui.tool.slip = {
	mousedown: function( e ) {
		_sample = e.target.gsSample;
		if ( _sample ) {
			_offset = _sample.wsample.offset;
		}
	},
	mouseup: function() {
		if ( _sample ) {
			gs.history.push( "slip", {
					sample: _sample,
					offset: _offset - _sample.wsample.offset
				}, {
					sample: _sample,
					offset: _sample.wsample.offset - _offset
			} );
			gs.samplesForEach( _sample, function( s ) {
				wa.composition.update( s.wsample, "mv" );
			} );
		}
		_sample = null;
	},
	mousemove: function( e, secRel ) {
		if ( _sample ) {
			return gs.samplesSlip( _sample, secRel );
		}
	}
};

var	_sample,
	_offset;

} )();
