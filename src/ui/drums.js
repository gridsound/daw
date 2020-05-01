"use strict";

function UIdrumsInit() {
	const win = UIwindows.window( "drums" );

	UIdrums.setDAWCore( DAW );
	UIdrums.setFontSize( 42 );
	UIdrums.setPxPerBeat( 120 );
	UIdrums.setWaveforms( UIpatterns.svgForms.bufferHD );
	UIdrums.rootElement.onfocus = () => DAW.drumsFocus();
	DOM.drumsName.onclick = UIdrumsNameClick;
	win.onresize =
	win.onresizing = ( w, h ) => UIdrums.resize( w, h );
	win.onfocusin = UIdrumsWindowFocusin;
	win.append( UIdrums.rootElement );
	UIdrums.attached();
}

function UIdrumsWindowFocusin( e ) {
	if ( !UIdrums.rootElement.contains( e.target ) ) {
		UIdrums.rootElement.focus();
	}
}

function UIdrumsNameClick() {
	const id = DAW.get.patternDrumsOpened(),
		name = DOM.drumsName.textContent;

	gsuiPopup.prompt( "Rename pattern", "", name, "Rename" )
		.then( name => DAW.callAction( "renamePattern", id, name ) );
}
