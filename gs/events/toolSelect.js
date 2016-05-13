"use strict";

ui.tool.select = {
	mousedown: function( e, sample ) {
		if ( !e.shiftKey ) {
			ui.samplesUnselect();
		}
		if ( sample ) {
			ui.sampleSelect( sample, !sample.selected );
		}
	}
};
