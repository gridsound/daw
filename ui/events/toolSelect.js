"use strict";

ui.tool.select = {
	mouseup: function() {},
	mousemove: function() {},
	mousedown: function( e, sample ) {
		if ( !e.shiftKey ) {
			ui.samplesUnselect();
		}
		if ( sample ) {
			ui.sampleSelect( sample, !sample.selected );
		}
	}
};
