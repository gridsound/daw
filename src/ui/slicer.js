"use strict";

function UIslicerInit() {
	const win = UIwindows.window( "slicer" );

	UIslicer.setDAWCore( DAW );
	UIslicer.rootElement.onfocus = () => DAW.focusOn( "slices" );
	DOM.slicesName.onclick = UIslicesNameClick;
	win.onfocusin = UIslicerWindowFocusin;
	win.contentAppend( UIslicer.rootElement );
}

function UIslicerWindowFocusin( e ) {
	if ( !UIslicer.rootElement.contains( e.target ) ) {
		UIslicer.rootElement.focus();
	}
}

function UIslicesNameClick() {
	const id = DAW.get.patternSlicesOpened(),
		name = DOM.slicesName.textContent;

	if ( id ) {
		GSUI.popup.prompt( "Rename pattern", "", name, "Rename" )
			.then( name => DAW.callAction( "renamePattern", id, name ) );
	}
}
