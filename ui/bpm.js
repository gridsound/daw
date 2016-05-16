"use strict";

ui.BPMem = 1;

ui.bpm = function( bpm ) {
	var bInt = ~~bpm,
		bCent = Math.min( Math.round( ( bpm - bInt ) * 100 ), 99 );

	ui.BPMem = bpm / 60;
	ui.jqBpmInt.text( bInt < 100 ? "0" + bInt : bInt );
	ui.jqBpmDec.text( bCent < 10 ? "0" + bCent : bCent );
};
