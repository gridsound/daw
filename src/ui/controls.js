"use strict";

ui.controls = {
	init() {
		dom.togglePlay.onclick = ui.controls._onclickTogglePlay;
	},
	togglePlay( b ) {
		dom.togglePlay.classList.toggle( "after", !b );
	},
	play() {
		dom.play.classList.remove( "ico-pause" );
	},
	pause() {
		dom.play.classList.add( "ico-pause" );
	},
	stop() {
		ui.controls.play();
	},
	bpm( bpm ) {
		dom.bpmNumber.textContent = bpm;
	},
	currentTime( sec ) {
		ui.controls.clock( sec );
	},
	clock( sec ) {
		var time = common.timestampText( sec, env.clockSteps && gs.currCmp.bpm );

		dom.clockMin.textContent = time.a;
		dom.clockSec.textContent = time.b;
		dom.clockMs.textContent = time.c;
	},
	title( s ) {
		document.title = ( gs.isCompositionNeedSave() ? "*" : "" ) + ( s || "GridSound" );
	},

	// private:
	_onclickTogglePlay() {
		gs.controls.togglePlay( !env.togglePlay );
	}
};
