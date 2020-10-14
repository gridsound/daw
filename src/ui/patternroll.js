"use strict";

function UIpatternrollInit() {
	const win = UIwindows.window( "main" );

	UIpatternroll.setDAWCore( DAW );
	UIpatternroll.setSVGForms( UIpatterns.svgForms );
	UIpatternroll.rootElement.onfocus = () => DAW.compositionFocus();
	win.onfocusin = UIpatternrollWindowFocusin;
	win.append( UIpatternroll.rootElement );
	UIpatternroll.attached();
}

function UIpatternrollWindowFocusin( e ) {
	if ( !UIpatternroll.rootElement.contains( e.target ) ) {
		UIpatternroll.rootElement.focus();
	}
}
