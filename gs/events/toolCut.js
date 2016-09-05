"use strict";

( function() {

var sampleSave;

ui.tool.cut = {
	mousedown: function( e ) {
		sampleSave = e.target.gsSample;
	},
	mouseup: function( e ) {
		if ( sampleSave ) {
			gs.samplesCut( sampleSave, ui.getGridSec( e.pageX ) );
		}
		sampleSave = null;
	}
};

} )();
