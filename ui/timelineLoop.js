"use strict";

ui.initElement( "timelineLoop", function( el ) {
	var cl = el.classList;

	return {
		show: cl.remove.bind( cl, "hidden" ),
		hide: cl.add.bind( cl, "hidden" ),
		when: function( sec ) {
			el.style.left = ( sec * ui.BPMem ) + "em";
		},
		duration: function( sec ) {
			el.style.width = ( sec * ui.BPMem ) + "em";
		}
	};
} );
