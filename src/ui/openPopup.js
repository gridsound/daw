"use strict";

class uiOpenPopup {
	constructor() {
		const inp = dom.openPopupContent.querySelectorAll( "input" );

		dom.openPopupContent.remove();
		this._inputURL = inp[ 0 ];
		this._inputFile = inp[ 1 ];
	}

	show() {
		this._inputFile.value =
		this._inputURL.value = "";
		gsuiPopup.custom( {
			title: "Open",
			submit: this._onsubmit.bind( this ),
			element: dom.openPopupContent,
		} );
		return false;
	}

	// private:
	_onsubmit() {
		const url = this._inputURL.value,
			file = this._inputFile.files[ 0 ];

		if ( url ) {
			gs.loadCompositionByURL( url );
		} else if ( file ) {
			gs.loadCompositionByBlob( file );
		}
	}
}
