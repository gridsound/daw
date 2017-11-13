"use strict";

ui.shortcutsPopup = {
	init() {
		dom.shortcuts.onclick = ui.shortcutsPopup.show;
	},
	show() {
		var cmp = gs.currCmp;

		gsuiPopup.custom( "Shortcuts", dom.shortcutsPopupContent );
		return false;
	}
};
