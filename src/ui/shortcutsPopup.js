"use strict";

function UIshortcutsPopupInit() {
	DOM.helpKeyboardShortcuts.onclick = UIshortcutsPopupShow;
}

function UIshortcutsPopupShow() {
	GSUI.popup.custom( {
		title: "Keyboard / mouse shortcuts",
		element: DOM.shortcutsPopupContent,
	} );
	return false;
}
