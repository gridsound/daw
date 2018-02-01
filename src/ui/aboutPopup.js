"use strict";

ui.aboutPopup = {
	init() {
		dom.aboutPopupContent.remove();
		dom.about.onclick = ui.aboutPopup.show;
	},
	show() {
		gsuiPopup.custom( "About", dom.aboutPopupContent );
		return false;
	}
};
