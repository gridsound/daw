"use strict";

ui.selectTool = function() {
	var oldBtnTool;

	return function( strTool ) {
		var fn, btnTool = ui.jqBtnTools.tool[ strTool ];

		if ( btnTool !== oldBtnTool ) {
			if ( oldBtnTool ) {
				oldBtnTool.classList.remove( "active" );
				if ( fn = ui.tool[ ui.currentTool ].mouseup ) {
					fn( {} );
				}
			}
			oldBtnTool = btnTool;
			ui.jqGrid[ 0 ].dataset.tool =
			ui.currentTool = strTool;
			btnTool.classList.add( "active" );
		}
	};
}();
