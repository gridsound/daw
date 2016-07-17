"use strict";

ui.BPMem = 1;

ui.bpm = function( bpm ) {
	var bInt = ~~bpm,
		bCent = Math.min( Math.round( ( bpm - bInt ) * 100 ), 99 );

	ui.BPMem = bpm / 60;
	ui.elBpmInt.textContent = bInt < 100 ? "0" + bInt : bInt;
	ui.elBpmDec.textContent = bCent < 10 ? "0" + bCent : bCent;
};
