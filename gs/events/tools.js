"use strict";

( function() {

ui.elBtnMagnet.onclick = ui.toggleMagnetism;

ui.elTools.onclick = function( e ) {
	if ( e = e.target.dataset.tool ) {
		ui.selectTool( e );
	}
};

var tool,
	tools = ui.elTools.children,
	i = 0;

ui.elTools.tool = {};
while ( tool = tools[ i++ ] ) {
	if ( tool.dataset.tool ) {
		ui.elTools.tool[ tool.dataset.tool ] = tool;
	}
}

} )();
