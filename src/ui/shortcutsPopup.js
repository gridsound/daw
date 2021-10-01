"use strict";

function UIshortcutsPopupInit() {
	DOM.helpKeyboard.onclick = UIshortcutsPopupShow;
}

function UIshortcutsPopupShow() {
	GSUI.popup.custom( {
		title: "Keyboard / mouse shortcuts",
		element: DOM.shortcutsPopupContent,
	} );
	return false;
}
