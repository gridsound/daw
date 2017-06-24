"use strict";

ui.settingsPopup = {
	init() {
		ui.idElements.settings.onclick = ui.settingsPopup.show;
	},
	show() {
		ui.idElements.settingsPopup.classList.remove( "hidden" );
	},
	hide() {
		ui.idElements.settingsPopup.classList.add( "hidden" );
	}
};
