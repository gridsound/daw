"use strict";

ui.openPopup = {
	init() {
		var inp = dom.openPopupContent.querySelectorAll( "input" );

		dom.openPopupContent.remove();
		ui.openPopup.inputURL = inp[ 0 ];
		ui.openPopup.inputFile = inp[ 1 ];
	},
	show() {
		ui.openPopup.inputFile.value =
		ui.openPopup.inputURL.value = "";
		gsuiPopup.custom( "Open", dom.openPopupContent, ui.openPopup._onsubmit );
		return false;
	},

	// private:
	_onsubmit() {
		var url = ui.openPopup.inputURL.value,
			file = ui.openPopup.inputFile.files[ 0 ];

		if ( url ) {
			gs.loadCompositionByURL( url );
		} else if ( file ) {
			gs.loadCompositionByBlob( file );
		}
	}
};
