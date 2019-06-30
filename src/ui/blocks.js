"use strict";

function UIblocksInit() {
	const win = UIwindows.window( "blocks" ),
		elCnt = win.rootElement.querySelector( ".gsuiWindow-content" ),
		panels = new gsuiPanels( elCnt );

	panels.attached();
}
