"use strict";

function UIpatternrollInit() {
	const win = UIwindows.window( "main" );

	UIpatternroll.setDAWCore( DAW );
	UIpatternroll.setSVGForms( UIpatterns.svgForms );
	UIpatternroll.rootElement.onfocus = () => DAW.compositionFocus();
	win.onfocusin = UIpatternrollWindowFocusin;
	win.contentAppend( UIpatternroll.rootElement );
}

function UIpatternrollWindowFocusin( e ) {
	if ( !UIpatternroll.rootElement.contains( e.target ) ) {
		UIpatternroll.rootElement.focus();
	}
}
