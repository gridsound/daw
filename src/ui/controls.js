"use strict";

ui.controls = {
	init() {
		ui.idElements.togglePlay.onclick = ui.controls._onclickTogglePlay;
	},
	togglePlay( b ) {
		ui.idElements.togglePlay.classList.toggle( "up", b );
	},
	play() {
		ui.idElements.play.classList.remove( "ico-pause" );
	},
	pause() {
		ui.idElements.play.classList.add( "ico-pause" );
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
		document.title = ( gs.isCompositionNeedSave() ? "*" : "" ) + ( s || "GridSound" );
	},

	// private:
	_onclickTogglePlay() {
		lg( "_onclickTogglePlay" );
	}
};
