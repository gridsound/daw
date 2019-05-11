"use strict";

function UIopenPopupShow() {
	DOM.inputOpenFile.value =
	DOM.inputOpenURL.value = "";
	gsuiPopup.custom( {
		title: "Open",
		submit: UIopenPopupSubmit,
		element: DOM.openPopupContent,
	} );
	return false;
}

function UIopenPopupSubmit( { url, file } ) {
	if ( url || file[ 0 ] ) {
		return ( url
			? DAW.addCompositionByURL( url )
			: DAW.addCompositionByBlob( file[ 0 ] )
		).then( cmp => DAW.openComposition( "local", cmp.id ) );
	}
}
