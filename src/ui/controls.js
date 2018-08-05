"use strict";

class uiControls {
	constructor() {
		const slider = new gsuiSlider();

		this.spectrum = new gsuiSpectrum();
		this.spectrum.setResolution( 512 );
		document.querySelector( "#analyser" ).appendChild( this.spectrum.rootElement );
		dom.togglePlay.onclick = this._onclickTogglePlay.bind( this );
		dom.play.onclick = this._onclickPlay.bind( this );
		dom.stop.onclick = this._onclickStop.bind( this );
		if ( document.cookie.indexOf( "cookieAccepted" ) > -1 ) {
			dom.eatCookies.remove();
		} else {
			dom.eatCookies.onclick = this._onclickCookies.bind( this );
		}
		slider.oninput = v => wa.destination.gain( v );
		slider.options( {
			type: "linear-y",
			min: 0,
			max: 1.5,
			step: .01,
			scrollStep: .1,
			value: env.def_appGain,
			startFrom: 0,
		} );
		dom.appGainWrap.append( slider.rootElement );
		slider.attached();
	}

	focusOn( grid ) {
		const main = grid === "main";

		dom.togglePlay.classList.toggle( "after", !main );
		dom.mainGridWrap.classList.toggle( "focus", main );
		dom.keysGridWrap.classList.toggle( "focus", !main );
		( main ? ui.mainGrid.patternroll : ui.pattern.pianoroll )
			.rootElement.focus();
	}
	play() {
		dom.play.classList.add( "ico-pause" );
	}
	pause() {
		dom.play.classList.remove( "ico-pause" );
	}
	stop() {
		this.pause();
	}
	bpm( bpm ) {
		dom.bpmNumber.textContent = bpm;
	}
	currentTime( grid, beat ) {
		if ( gs.controls._grid === grid ) {
			this.clock( beat );
		}
		if ( grid === "main" ) {
			ui.mainGrid.patternroll.currentTime( beat );
		} else {
			ui.pattern.pianoroll.currentTime( beat );
		}
	}
	loop( grid, isLoop, loopA, loopB ) {
		if ( grid === "main" ) {
			ui.mainGrid.patternroll.loop( isLoop && loopA, loopB );
		} else {
			ui.pattern.pianoroll.loop( isLoop && loopA, loopB );
		}
	}
	updateClock() {
		this.clock( this._beat );
	}
	clock( beat ) {
		this._beat = beat;
		( env.clockSteps ? this._clockBeat : this._clockSec )( beat );
	}
	title( s ) {
		document.title = ( gs.isCompositionNeedSave() ? "*" : "" ) + ( s || "GridSound" );
	}

	// private:
	_clockSec( beat ) {
		beat = beat * 60 / gs.currCmp.bpm;
		dom.clockMin.textContent = common.time.secToMin( beat );
		dom.clockSec.textContent = common.time.secToSec( beat );
		dom.clockMs.textContent  = common.time.secToMs( beat );
	}
	_clockBeat( beat ) {
		dom.clockMin.textContent = common.time.beatToBeat( beat );
		dom.clockSec.textContent = common.time.beatToStep( beat, gs.currCmp.stepsPerBeat );
		dom.clockMs.textContent  = common.time.beatToMStep( beat, gs.currCmp.stepsPerBeat );
	}

	// events:
	_onclickTogglePlay() {
		gs.controls.focusOn( gs.controls._grid === "main" ? "pattern" : "main" );
		return false;
	}
	_onclickPlay() {
		gs.controls.status === "playing"
			? gs.controls.pause()
			: gs.controls.play();
		return false;
	}
	_onclickStop() {
		gs.controls.stop();
		return false;
	}
	_onclickCookies() {
		gsuiPopup.confirm(
			"Cookie law",
			"By clicking <b>Ok</b> you accept to let the GridSound's DAW<br/>"
			+ "using Cookies to offers you two features&nbsp;:<ul>"
			+ "<li>Saving compositions locally (localStorage)</li>"
			+ "<li>Offline mode (serviceWorker)</li>"
			+ "</ul>",
			"Accept", "Decline"
		).then( b => {
			if ( b ) {
				document.cookie = "cookieAccepted";
				dom.eatCookies.remove();
			}
		} );
		return false;
	}
}
