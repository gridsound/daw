"use strict";

(function() {

function zoom( e, z ) {
	ui.setGridZoom(
		ui.gridZoom * z,
		e.pageX - ui.filesWidth - ui.trackNamesWidth,
		e.pageY - ui.gridColsY
	);
}

ui.tool.zoom = {
	wheel: function( e ) {
		zoom( e, e.deltaY < 0 ? 1.1 : .9 );
	},
	mousedown: function( e ) {
		if ( e.button === 0 ) {
			zoom( e, e.altKey ? .8 : 1.2 );
		}
	}
};

})();
