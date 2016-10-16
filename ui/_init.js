"use strict";

( function() {

var k,
	tpl = Handlebars.templates,
	elApp = wisdom.qS( "#app" );

// Creating all the DOM :
for ( k in tpl ) {
	if ( k !== "_app" ) {
		Handlebars.registerPartial( k, tpl[ k ] );
	}
}
elApp.innerHTML = Handlebars.templates._app( {} );

// Remove all whitespace nodes :
function rmChild( el ) {
	var save, n = el.firstChild;
	while ( n !== null ) {
		rmChild( save = n );
		n = n.nextSibling;
		if ( save.nodeType !== 1 && /^\s*$/.test( save.textContent ) ) {
			el.removeChild( save );
		}
	}
}
rmChild( document.body );

ui.domInit( elApp );
ui.dom.toolBtns = wisdom.qSA( ui.dom.menu, ".btn[data-tool]" );
ui.tool = {};
ui.tracks = [];
ui.nbTracksOn = 0;
ui.gridEm = parseFloat( getComputedStyle( ui.dom.grid ).fontSize );
ui.gridColsY = ui.dom.gridCols.getBoundingClientRect().top;
ui.dom.visualCanvas.width = 256;
ui.dom.visualCanvas.height = ui.dom.visualCanvas.clientHeight;

} )();
