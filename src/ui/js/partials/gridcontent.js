"use strict";

ui.gridcontent = {
	init: function() {
		ui.dom.gridcontent.oncontextmenu = ui.gridcontent._contextmenu;
		ui.dom.gridcontent.onmousedown = ui.gridcontent._mousedown;
	},
	left: function( xpx ) {
		ui.trackLinesLeft = xpx = Math.min( ~~xpx, 0 );
		ui.dom.gridcontent.style.marginLeft = xpx / ui.gridEm + "em";
		ui.grid.updateLeftShadow();
	},

	// private:
	_contextmenu: function() {
		return false;
	},
	_mousedown: function( e ) {
		if ( e.button === 2 ) {
			ui.tools.save();
			ui.tools.select( "delete" );
		}

		var tool = ui.tool[ ui.currentTool ];

		ui.mousedownBind = tool.mousedown;
		ui.mousemoveBind = tool.mousemove;
		ui.mouseupBind = function( e ) {
			tool.mouseup && tool.mouseup( e );
			ui.tools.restore();
		};
	}
};
