"use strict";

function UIshortcutsPopupInit() {
	DOM.helpKeyboardShortcuts.onclick = UIshortcutsPopupShow;
}

function UIshortcutsPopupShow() {
	gsuiPopup.custom( {
		title: "Keyboard / mouse shortcuts",
		element: DOM.shortcutsPopupContent,
	} );
	return false;
}
