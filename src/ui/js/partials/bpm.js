"use strict";

ui.bpm = {
	init: function() {
		ui.dom.bpm.onclick = ui.bpm._click;
	},
	set: function( bpm ) {
		var bInt = ~~bpm,
			bCent = Math.min( Math.round( ( bpm - bInt ) * 100 ), 99 );

		ui.BPMem = bpm / 60;
		ui.dom.bpmInt.textContent = bInt < 100 ? "0" + bInt : bInt;
		ui.dom.bpmDec.textContent = bCent < 10 ? "0" + bCent : bCent;
	},

	// private:
	_click: function() {
		gsuiPopup.prompt( "BPM", "Choose your BPM (between 1 and 1000) :", waFwk.bpm )
			.then( function( bpm ) {
				+bpm && waFwk.do( "bpm", +bpm );
			} );
	}
};
