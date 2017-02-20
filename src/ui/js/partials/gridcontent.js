"use strict";

ui.gridcontent = {
	init: function() {
		ui.dom.gridcontent.oncontextmenu = function() { return false; };
		ui.dom.gridcontent.onmousedown = function( e ) {
			if ( !ui.mouseIsDown ) {
				var fn;

				ui.mouseIsDown = true;
				ui.mousedownSec = ui.grid.getWhen( e.pageX );
				ui.px_x = e.pageX;
				ui.px_y = e.pageY;
				if ( e.button === 2 ) {
					ui.tools.save();
					ui.tools.select( "delete" );
				}
				fn = ui.tool[ ui.currentTool ].mousedown;
				fn && fn( e );
			}
		};
	},
	left: function( xpx ) {
		ui.trackLinesLeft = xpx = Math.min( ~~xpx, 0 );
		ui.dom.gridcontent.style.marginLeft = xpx / ui.gridEm + "em";
		ui.updateGridLeftShadow();
	}
};
