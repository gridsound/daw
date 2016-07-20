"use strict";

ui.elBtnMagnet.onclick = ui.toggleMagnetism;

ui.elToolBtns.tool = {};
ui.elToolBtns.forEach( function( btn ) {
	ui.elToolBtns.tool[ btn.dataset.tool ] = btn;
	btn.onclick = ui.selectTool.bind( null, btn.dataset.tool );
} );
