"use strict";

(function() {

var sampleSave;

ui.tool.cut = {
	mousedown: function( e, sample ) {
		sampleSave = sample;
	},
	mouseup: function( e ) {
		if ( sampleSave ) {
			var sec = ui.getGridXem( e.pageX ) / ui.BPMem;
			var dist = sec - sampleSave.wsample.when;
			
			var ns = gs.sampleCreate( sampleSave.gsfile, sampleSave.track.id, ( sampleSave.wsample.when + dist ) * ui.BPMem );
			ns.slip( sampleSave.wsample.offset + dist);
			ns.duration( sampleSave.wsample.duration - dist );

			sampleSave.duration( dist );
		}
		sampleSave = null;
	}
};

})();