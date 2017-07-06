"use strict";

ui.controls = {
	play() {
		ui.idElements.play.classList.remove( "pause" );
	},
	pause() {
		ui.idElements.play.classList.add( "pause" );
	},
	stop() {
		ui.controls.play();
	},
	bpm( bpm ) {
		ui.idElements.bpmNumber.textContent = bpm;
	},
	currentTime( sec ) {
		ui.controls.clock( sec );
	},
	clock( sec ) {
		var time = common.timestampText( sec, settings.clockSteps && gs.currCmp.bpm );

		ui.idElements.clockMin.textContent = time.a;
		ui.idElements.clockSec.textContent = time.b;
		ui.idElements.clockMs.textContent = time.c;
	},
	title( s ) {
		document.title = ( gs.currCmpSaved ? "" : "*" ) + ( s || "GridSound" );
	}
};
