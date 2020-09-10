"use strict";

function UIpatternrollInit() {
	const win = UIwindows.window( "main" );

	UIpatternroll.setDAWCore( DAW );
	UIpatternroll.setSVGForms( UIpatterns.svgForms );
	UIpatternroll.setFontSize( 32 );
	UIpatternroll.setPxPerBeat( 40 );
	UIpatternroll.rootElement.onfocus = () => DAW.compositionFocus();
	win.onresize =
	win.onresizing = () => UIpatternroll.resized();
	win.onfocusin = UIpatternrollWindowFocusin;
	win.append( UIpatternroll.rootElement );
	UIpatternroll.attached();
}

function UIpatternrollWindowFocusin( e ) {
	if ( !UIpatternroll.rootElement.contains( e.target ) ) {
		UIpatternroll.rootElement.focus();
	}
}
