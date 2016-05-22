"use strict";

ui.tool.select = {
	mousedown: function( e, sample ) {
		if ( !e.shiftKey ) {
			gs.samplesUnselect();
		}
		if ( sample ) {
			gs.sampleSelect( sample, !sample.selected );
		}
	}
};
