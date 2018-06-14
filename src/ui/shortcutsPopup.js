"use strict";

class uiShortcutsPopup {
	constructor() {
		dom.shortcutsPopupContent.remove();
		dom.shortcuts.onclick = this.show.bind( this );
	}

	show() {
		gsuiPopup.custom( "Keyboard / mouse shortcuts", dom.shortcutsPopupContent );
		return false;
	}
}
