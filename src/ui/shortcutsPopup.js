"use strict";

ui.shortcutsPopup = {
	init() {
		dom.shortcutsPopupContent.remove();
		dom.shortcuts.onclick = ui.shortcutsPopup.show;
	},
	show() {
		gsuiPopup.custom( "Shortcuts", dom.shortcutsPopupContent );
		return false;
	}
};
