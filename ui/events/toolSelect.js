"use strict";

ui.tool.select = {
	mouseup: function() {},
	mousemove: function() {},
	mousedown: function( e ) {
		var sample = e.target.uisample;
		if ( !e.shiftKey ) {
			ui.samplesUnselect();
		}
		if ( sample ) {
			ui.sampleSelect( sample, !sample.selected );
		}
	}
};
