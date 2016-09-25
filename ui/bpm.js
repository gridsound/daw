"use strict";

ui.bpm = function( bpm ) {
	var bInt = ~~bpm,
		bCent = Math.min( Math.round( ( bpm - bInt ) * 100 ), 99 );

	ui._bpm = bpm;
	ui.elBpmInt.textContent = bInt < 100 ? "0" + bInt : bInt;
	ui.elBpmDec.textContent = bCent < 10 ? "0" + bCent : bCent;
};
