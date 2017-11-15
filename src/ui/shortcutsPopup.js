"use strict";

ui.shortcutsPopup = {
	init() {
		dom.shortcutsPopupContent.remove();
		dom.shortcuts.onclick = ui.shortcutsPopup.show;
	},
	show() {
		gsuiPopup.custom( "Keyboard / mouse shortcuts", dom.shortcutsPopupContent );
		return false;
	}
};
