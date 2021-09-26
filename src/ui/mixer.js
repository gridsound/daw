"use strict";

function UImixerInit() {
	const win = UIwindows.window( "mixer" );

	win.contentAppend( UImixer.rootElement );
	UImixer.setDAWCore( DAW );
	UImixer.onselectChan = id => UIeffectsSelectChan( id );
}

function UImixerOpenChanPopup( objId ) {
	const currChanId = DAW.get.synth( objId ).dest;

	gsuiPatterns.selectChanPopupSelect.value = currChanId;
	GSUI.popup.custom( {
		title: "Channels",
		element: gsuiPatterns.selectChanPopupContent,
		submit( { channel } ) {
			if ( channel !== currChanId ) {
				DAW.callAction( "redirectSynth", objId, channel );
			}
		}
	} );
}
