"use strict";

class uiShortcutsPopup {
	constructor() {
		dom.shortcutsPopupContent.remove();
		dom.shortcuts.onclick = this.show.bind( this );
	}

	show() {
		gsuiPopup.custom( {
			title: "Keyboard / mouse shortcuts",
			element: dom.shortcutsPopupContent,
		} );
		return false;
	}
}
