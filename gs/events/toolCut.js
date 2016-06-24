"use strict";

(function() {

var sampleSave;

ui.tool.cut = {
	mousedown: function( e, sample ) {
		sampleSave = sample;
	},
	mouseup: function( e ) {
		if ( sampleSave ) {
			gs.samplesCut( sampleSave, ui.getGridXem( e.pageX ) / ui.BPMem );
		}
		sampleSave = null;
	}
};

})();
