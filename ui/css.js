"use strict";

ui.css = function( el, prop, val ) {
	if ( el ) {
		var st = getComputedStyle( el );
		if ( arguments.length === 2 ) {
			return st[ prop ];
		}
		el.style[ prop ] = val;
	}
};
