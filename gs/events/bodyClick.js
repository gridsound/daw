"use strict";

document.body.addEventListener( "mousedown", function() {
	ui.dom.bpm.classList.remove( "clicked" );
	ui.dom.saveCheckbox.checked = false;
} );
