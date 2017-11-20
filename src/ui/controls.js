"use strict";

ui.controls = {
	init() {
		var slider = new gsuiSlider();

		dom.togglePlay.onclick = ui.controls._onclickTogglePlay;
		dom.play.onclick = ui.controls._onclickPlay;
		dom.stop.onclick = ui.controls._onclickStop;

		slider.oninput = v => wa.destination.gain( v * v );
		slider.options( {
			type: "linear-y",
			min: 0,
			max: 1.5,
			step: .01,
			scrollStep: .1,
			value: 1,
			startFrom: 0,
		} );
		dom.appGainWrap.append( slider.rootElement );
		slider.resized();
	},
	focusOn( grid ) {
		dom.togglePlay.classList.toggle( "after", grid !== "main" );
		dom.mainGridWrap.classList.toggle( "focus", grid === "main" );
		dom.keysGridWrap.classList.toggle( "focus", grid === "pattern" );
		( grid === "main" ? ui.mainGridSamples : ui.keysGridSamples )
			.rootElement.focus();
	},
	play() {
		dom.play.classList.add( "ico-pause" );
	},
	pause() {
		dom.play.classList.remove( "ico-pause" );
	},
	stop() {
		ui.controls.pause();
	},
	bpm( bpm ) {
		dom.bpmNumber.textContent = bpm;
	},
	currentTime( grid, beat ) {
		if ( gs.controls._grid === grid ) {
			ui.controls.clock( beat );
		}
		if ( grid === "main" ) {
			ui.mainGridSamples.currentTime( beat );
		} else {
			ui.keysGridSamples.currentTime( beat );
		}
	},
	loop( grid, isLoop, loopA, loopB ) {
		if ( grid === "main" ) {
			ui.mainGridSamples.loop( isLoop && loopA, loopB );
		} else {
			ui.keysGridSamples.loop( isLoop && loopA, loopB );
		}
	},
	switchClock() {
		ui.controls.clock( ui.controls._beat );
	},
	clock( beat ) {
		ui.controls._beat = beat;
		( env.clockSteps ? ui.controls._clockBeat : ui.controls._clockSec )( beat );
	},
	title( s ) {
		document.title = ( gs.isCompositionNeedSave() ? "*" : "" ) + ( s || "GridSound" );
	},

	// private:
	_clockSec( beat ) {
		beat = beat * 60 / gs.currCmp.bpm;
		dom.clockMin.textContent = common.time.secToMin( beat );
		dom.clockSec.textContent = common.time.secToSec( beat );
		dom.clockMs.textContent  = common.time.secToMs( beat );
	},
	_clockBeat( beat ) {
		dom.clockMin.textContent = common.time.beatToBeat( beat );
		dom.clockSec.textContent = common.time.beatToStep( beat, gs.currCmp.stepsPerBeat );
		dom.clockMs.textContent  = common.time.beatToMStep( beat, gs.currCmp.stepsPerBeat );
	},

	// events:
	_onclickTogglePlay() {
		gs.controls.focusOn( gs.controls._grid === "main" ? "pattern" : "main" );
		return false;
	},
	_onclickPlay() {
		gs.controls.status === "playing"
			? gs.controls.pause()
			: gs.controls.play();
		return false;
	},
	_onclickStop() {
		gs.controls.stop();
		return false;
	}
};
