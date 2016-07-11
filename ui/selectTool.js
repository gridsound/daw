"use strict";

ui.selectTool = function() {
	var oldBtnTool;

	return function( strTool ) {
		var uiTool, btnTool = ui.jqBtnTools.tool[ strTool ];

		if ( btnTool !== oldBtnTool ) {
			if ( oldBtnTool ) {
				oldBtnTool.classList.remove( "active" );
				uiTool = ui.tool[ ui.currentTool ];
				uiTool.mouseup && uiTool.mouseup( {} );
				uiTool.end && uiTool.end();
			}
			oldBtnTool = btnTool;
			btnTool.classList.add( "active" );
			ui.jqGrid[ 0 ].dataset.tool =
			ui.currentTool = strTool;
			uiTool = ui.tool[ strTool ];
			if ( uiTool.start ) {
				uiTool.start();
			}
		}
	};
}();
