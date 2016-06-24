"use strict";

(function() {

var sampleSave;

ui.tool.cut = {
	mousedown: function( e, sample ) {
		sampleSave = sample;
	},
	mouseup: function( e ) {
		if ( sampleSave ) {
			sampleSave.cut( ui.getGridXem( e.pageX ) / ui.BPMem );
		}
		sampleSave = null;
	}
};

})();