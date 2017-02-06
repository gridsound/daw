"use strict";

waFwk.on.loadSource = function( srcObj ) {
	var usrDat = srcObj.userData,
		buf = srcObj.bufferSample.buffer,
		bufDur = buf.duration,
		bufData0 = buf.getChannelData( 0 ),
		bufData1 = buf.numberOfChannels < 2 ? bufData0 : buf.getChannelData( 1 );

	usrDat.isLoaded = true;
	usrDat.isLoading = false;
	usrDat.uiWaveform = new gsuiWaveform( usrDat.elWave );
	usrDat.uiWaveform.setResolution( 250, 40 );
	usrDat.uiWaveform.draw( bufData0, bufData1, bufDur, 0, bufDur );
	usrDat.elRoot.classList.add( "loaded" );
	usrDat.elRoot.classList.remove( "unloaded" );
	usrDat.elIcon.remove();

	// joinfile part
	// usrDat.that.wbuff.samples.forEach( function( smp ) {
	// 	smp.data.elName.textContent = usrDat.that.name;
	// 	ui.sample.duration( smp );
	// } );
};
