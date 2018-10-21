"use strict";

function UIshortcutsPopupInit() {
	DOM.shortcuts.onclick = UIshortcutsPopupShow;
}

function UIshortcutsPopupShow() {
	gsuiPopup.custom( {
		title: "Keyboard / mouse shortcuts",
		element: DOM.shortcutsPopupContent,
	} );
	return false;
}
