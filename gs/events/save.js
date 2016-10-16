"use strict";

ui.dom.btnSave.onclick = function() {
	var att = gs.save();

	ui.dom.btnSave.setAttribute( "href", att.href );
	ui.dom.btnSave.setAttribute( "download", att.download );
};
