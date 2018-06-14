"use strict";

class uiAboutPopup {
	constructor() {
		dom.aboutPopupContent.remove();
		dom.about.onclick = this.show.bind( this );
	}

	show() {
		gsuiPopup.custom( "About", dom.aboutPopupContent );
		return false;
	}
}
