"use strict";

ui.selectTool = function() {
	var oldBtn;

	return function( strTool ) {
		var uiTool, btn = ui.elToolBtns.tool[ strTool ];

		if ( btn !== oldBtn ) {
			if ( oldBtn ) {
				oldBtn.classList.remove( "active" );
				uiTool = ui.tool[ ui.currentTool ];
				uiTool.mouseup && uiTool.mouseup( {} );
				uiTool.end && uiTool.end();
			}
			oldBtn = btn;
			btn.classList.add( "active" );
			ui.elGrid.dataset.tool =
			ui.currentTool = strTool;
			uiTool = ui.tool[ strTool ];
			if ( uiTool.start ) {
				uiTool.start();
			}
		}
	};
}();
