"use strict";

( function() {

var loop = ui.dom.timelineLoop,
	cl = loop.classList;

ui.timelineLoop = {
	show: cl.remove.bind( cl, "hidden" ),
	hide: cl.add.bind( cl, "hidden" ),
	when: function( sec ) {
		loop.style.left = ( sec * ui.BPMem ) + "em";
	},
	duration: function( sec ) {
		loop.style.width = ( sec * ui.BPMem ) + "em";
	}
};

} )();
