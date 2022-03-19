"use strict";

function UImixerInit() {
	const win = UIwindows.window( "mixer" );

	win.contentAppend( UImixer.rootElement );
	UImixer.setDAWCore( DAW );
	UImixer.onselectChan = id => UIeffectsSelectChan( id );
}
