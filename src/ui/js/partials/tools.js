"use strict";

ui.toolsInit = function() {
	ui.dom.toolBtns = Array.from( ui.dom.menu.querySelectorAll( ".btn[data-tool]" ) );
	ui.dom.toolBtns.tool = {};
	ui.dom.toolBtns.forEach( function( btn ) {
		ui.dom.toolBtns.tool[ btn.dataset.tool ] = btn;
		btn.onclick = ui.toolsSelect.bind( null, btn.dataset.tool );
	} );
};

ui.toolsSelect = function( strTool ) {
	var uiTool, btn = ui.dom.toolBtns.tool[ strTool ];

	if ( btn !== ui._toolsOldBtn ) {
		if ( ui._toolsOldBtn ) {
			ui._toolsOldBtn.classList.remove( "active" );
			uiTool = ui.tool[ ui.currentTool ];
			uiTool.mouseup && uiTool.mouseup( {} );
			uiTool.end && uiTool.end();
		}
		ui._toolsOldBtn = btn;
		btn.classList.add( "active" );
		ui.dom.grid.dataset.tool =
		ui.currentTool = strTool;
		uiTool = ui.tool[ strTool ];
		if ( uiTool.start ) {
			uiTool.start();
		}
	}
};
