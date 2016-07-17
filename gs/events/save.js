"use strict";

ui.elBtnSave.onclick = function() {
	var att = gs.save();
	ui.elBtnSave.setAttribute( "href", att.href );
	ui.elBtnSave.setAttribute( "download", att.download );
};
