"use strict";

ui.tools = {
	init: function() {
		ui.dom.toolBtns = Array.from( ui.dom.menu.querySelectorAll( ".btn[data-tool]" ) );
		ui.dom.toolBtns.tool = {};
		ui.dom.toolBtns.forEach( function( btn ) {
			ui.dom.toolBtns.tool[ btn.dataset.tool ] = btn;
			btn.onclick = ui.tools.select.bind( null, btn.dataset.tool );
		} );
	},
	save: function() {
		ui.tools._saved = ui.currentTool;
	},
	restore: function() {
		if ( ui.tools._saved ) {
			ui.tools.select( ui.tools._saved );
			ui.tools._saved = null;
		}
	},
	select: function( strTool ) {
		var uiTool, btn = ui.dom.toolBtns.tool[ strTool ];

		if ( btn !== ui.tools._oldBtn ) {
			if ( ui.tools._oldBtn ) {
				ui.tools._oldBtn.classList.remove( "active" );
				uiTool = ui.tool[ ui.currentTool ];
				uiTool.mouseup && uiTool.mouseup( {} );
				uiTool.end && uiTool.end();
			}
			ui.tools._oldBtn = btn;
			btn.classList.add( "active" );
			ui.dom.grid.dataset.tool =
			ui.currentTool = strTool;
			uiTool = ui.tool[ strTool ];
			if ( uiTool.start ) {
				uiTool.start();
			}
		}
	}
};
