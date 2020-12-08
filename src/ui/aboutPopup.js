"use strict";

function UIaboutPopupInit() {
	DOM.helpAbout.onclick = UIaboutPopupShow;
	DOM.versionCheck.onclick = UIaboutPopupVersionCheck;
}

function UIaboutPopupShow() {
	gsuiPopup.custom( {
		title: "About",
		element: DOM.aboutPopupContent,
	} );
	return false;
}

function UIaboutPopupVersionCheck() {
	const dt = DOM.versionIcon.dataset;

	dt.icon = "none";
	dt.spin = "on";
	fetch( `https://gridsound.com/daw/VERSION?${ Math.random() }` )
		.then( res => res.text(), GSUtils.noop )
		.then( res => {
			dt.spin = "";
			dt.icon = res === VERSION ? "check" : "warning";
		} );
	return false;
}
