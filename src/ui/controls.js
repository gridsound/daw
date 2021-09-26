"use strict";

const UIclock = GSUI.createElement( "gsui-clock" );

function UIcontrolsInit() {
	DOM.sliderGain = DOM.headGain.querySelector( "gsui-slider" );
	DOM.sliderTime = DOM.headCurrentTime.querySelector( "gsui-slider" );
	DOM.play.onclick = UIcontrolsClickPlay;
	DOM.stop.onclick = UIcontrolsClickStop;
	DOM.reset.onclick = UIcontrolsClickReset;
	DOM.headTempo.onclick = UIcontrolsClickTempo;
	DOM.playToggle.onclick = UIcontrolsClickPlayToggle;
	DOM.tempoBPMTap.onclick = UIcontrolsBPMTap;
	DOM.headCmpInfo.onclick = UIcontrolsClickCmp;
	DOM.headCmpSave.onclick = UIcompositionClickSave;
	DOM.cmpsBtn.onmousedown =
	DOM.undoMore.onmousedown = UIcontrolsDropdownBtnClick;
	DOM.sliderGain.setValue( DAW.destination.getGain() );
	UIclock.classList.add( "btnGroup", "btnMarge" );
	DOM.headPlay.after( UIclock );
	UIclock.onchangeDisplay = mode => localStorage.setItem( "gsuiClock.display", mode );
	GSUI.setAttribute( UIclock, "mode", localStorage.getItem( "gsuiClock.display" ) || "second" );
	GSUI.listenEvents( DOM.sliderGain, {
		gsuiSlider: {
			input: d => DAW.destination.setGain( d.args[ 0 ] ),
			inputStart: GSUI.noop,
			inputEnd: GSUI.noop,
			change: GSUI.noop,
		},
	} );
	GSUI.listenEvents( DOM.sliderTime, {
		gsuiSlider: {
			input: d => {
				const beat = UIcontrolsGetFocusedGrid().timeline.previewCurrentTime( d.args[ 0 ] );

				UIclock.setTime( beat );
			},
			change: d => {
				const beat = UIcontrolsGetFocusedGrid().timeline.previewCurrentTime( false );

				DAW.getFocusedObject().setCurrentTime( beat );
			},
			inputEnd: () => {
				DAW.cb.clockUpdate = UIcontrolsClockUpdate;
			},
			inputStart: d => {
				DAW.cb.clockUpdate = null;
				UIclock.setTime( d.args[ 0 ] );
			},
		},
	} );
}

function UIcontrolsBPMTap() {
	DOM.tempoBPM.value = Math.floor( gswaBPMTap.tap() );
}

function UIcontrolsClockUpdate( beat ) {
	UIclock.setTime( beat );
}

function UIcontrolsCurrentTime( beat, focused ) {
	UIcontrolsGetFocusedGrid( focused ).currentTime( beat );
	DOM.sliderTime.setValue( beat );
}

function UIcontrolsClickCmp() {
	GSUI.popup.prompt( "Composition's title", "", DAW.get.name(), "Rename" )
		.then( name => DAW.callAction( "renameComposition", name ) );
}

function UIcontrolsClickPlay() {
	DAW.togglePlay();
}

function UIcontrolsClickPlayToggle() {
	DAW.getFocusedName() === "composition"
		? DAW.pianorollFocus( "-f" )
		: DAW.compositionFocus( "-f" );
}

function UIcontrolsClickStop() {
	DAW.stop();
	switch ( document.activeElement ) {
		case UIdrums.rootElement: DAW.drumsFocus( "-f" ); break;
		case UIpianoroll.rootElement: DAW.pianorollFocus( "-f" ); break;
		case UIpatternroll.rootElement: DAW.compositionFocus( "-f" ); break;
	}
}

function UIcontrolsClickReset() {
	DAW.resetAudioContext();
}

function UIcontrolsGetFocusedGrid( focStr = DAW.getFocusedName() ) {
	return ( focStr === "composition"
		? UIpatternroll
		: focStr === "drums"
			? UIdrums
			: UIpianoroll ).rootElement;
}

function UIcontrolsFocusOn( focStr, b ) {
	if ( b ) {
		const focObj = DAW.getFocusedObject(),
			beat = focObj.getCurrentTime(),
			duration = ( focObj === DAW.composition ? focObj.cmp : focObj ).duration,
			grid = UIcontrolsGetFocusedGrid( focStr ),
			onCmp = focStr === "composition";

		DOM.playToggle.dataset.dir = onCmp ? "up" : "down";
		DOM.sliderTime.setAttribute( "max", duration || DAW.get.beatsPerMeasure() );
		DOM.sliderTime.setValue( beat );
		UIdrums.rootElement.classList.toggle( "selected", focStr === "drums" );
		UIpianoroll.rootElement.classList.toggle( "selected", focStr === "pianoroll" );
		UIpatternroll.rootElement.classList.toggle( "selected", onCmp );
		grid.focus();
	}
}

function UIcontrolsDropdownBtnClick( e ) {
	const foc = document.activeElement,
		tar = e.currentTarget;

	if ( foc === tar || foc === tar.nextElementSibling ) {
		e.preventDefault();
		foc.blur();
	}
}

function UIcontrolsClickTempo() {
	DOM.tempoBeatsPM.value = DAW.get.beatsPerMeasure();
	DOM.tempoStepsPB.value = DAW.get.stepsPerBeat();
	DOM.tempoBPM.value = DAW.get.bpm();
	gswaBPMTap.reset();
	GSUI.popup.custom( {
		title: "Tempo",
		element: DOM.tempoPopupContent,
		submit( d ) {
			DAW.callAction( "changeTempo", d.bpm, d.beatsPerMeasure, d.stepsPerBeat );
		},
	} );
}
