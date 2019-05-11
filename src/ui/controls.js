"use strict";

const UIclock = new gsuiClock();

function UIcontrolsInit() {
	const sliderGain = new gsuiSlider(),
		sliderTime = new gsuiSlider();

	DOM.sliderTime = sliderTime;
	DOM.play.onclick = UIcontrolsClickPlay;
	DOM.stop.onclick = UIcontrolsClickStop;
	DOM.headTempo.onclick = UIcontrolsClickTempo;
	DOM.playToggle.onclick = UIcontrolsClickPlayToggle;
	DOM.tempoBPMTap.onclick = UIcontrolsBPMTap;
	DOM.headCmpInfo.onclick = UIcontrolsClickCmp;
	DOM.headCmpSave.onclick = UIcompositionClickSave;
	DOM.cmpsBtn.onmousedown =
	DOM.undoMore.onmousedown = UIcontrolsDropdownBtnClick;
	sliderGain.oninput = v => DAW.destination.setGain( v );
	sliderGain.options( {
		type: "linear-y", min: 0, max: 1, step: .01, scrollStep: .1,
		value: DAW.destination.getGain(),
	} );
	sliderTime.options( { type: "linear-x", step: .01 } );
	sliderTime.oninput = UIcontrolsSliderTime_oninput;
	sliderTime.onchange = UIcontrolsSliderTime_onchange;
	sliderTime.oninputend = UIcontrolsSliderTime_oninputend;
	sliderTime.oninputstart = UIcontrolsSliderTime_inputstart;
	DOM.headGain.append( sliderGain.rootElement );
	DOM.headCurrentTime.append( sliderTime.rootElement );
	UIclock.rootElement.classList.add( "btnGroup", "btnMarge" );
	DOM.headPlay.after( UIclock.rootElement );
	UIclock.onchangeDisplay = mode => localStorage.setItem( "gsuiClock.display", mode );
	UIclock.setDisplay( localStorage.getItem( "gsuiClock.display" ) || "second" );
	UIclock.attached();
	sliderGain.attached();
	sliderTime.attached();
}

function UIcontrolsSliderTime_inputstart( beat ) {
	DAW.cb.clockUpdate = null;
	UIclock.setTime( "beat", beat );
}
function UIcontrolsSliderTime_oninputend( _beat ) {
	DAW.cb.clockUpdate = UIcontrolsClockUpdate;
}
function UIcontrolsSliderTime_oninput( beat ) {
	const beatRound = UIcontrolsGetFocusedGrid().timeline.previewCurrentTime( beat );

	UIclock.setTime( "beat", beatRound );
}
function UIcontrolsSliderTime_onchange() {
	const beat = UIcontrolsGetFocusedGrid().timeline.previewCurrentTime( false );

	( DAW.compositionFocused ? DAW.composition : DAW.pianoroll ).setCurrentTime( beat );
}

function UIcontrolsBPMTap() {
	DOM.tempoBPM.value = Math.floor( gswaBPMTap.tap() );
}

function UIcontrolsClockUpdate( beat ) {
	UIclock.setTime( "beat", beat );
}

function UIcontrolsCurrentTime( beat, focused ) {
	UIcontrolsGetFocusedGrid( focused ).currentTime( beat );
	DOM.sliderTime.setValue( beat );
}

function UIcontrolsClickCmp() {
	gsuiPopup.prompt( "Composition's title", "", DAW.get.name(), "Rename" )
		.then( name => DAW.nameComposition( name ) );
}

function UIcontrolsClickPlay() {
	DAW.togglePlay();
}

function UIcontrolsClickPlayToggle() {
	DAW.compositionFocused
		? DAW.pianorollFocus( "-f" )
		: DAW.compositionFocus( "-f" );
}

function UIcontrolsClickStop() {
	DAW.stop();
	switch ( document.activeElement ) {
		case UIpatternroll.rootElement: DAW.compositionFocus( "-f" ); break;
		case UIpianoroll.rootElement: DAW.pianorollFocus( "-f" ); break;
	}
}

function UIcontrolsGetFocusedGrid( focused ) {
	const cmpFoc = focused
			? focused === "composition"
			: DAW.compositionFocused;

	return cmpFoc ? UIpatternroll : UIpianoroll;
}

function UIcontrolsFocusOn( subject, b ) {
	if ( b ) {
		const onCmp = subject === "composition",
			beat = ( DAW.compositionFocused ? DAW.composition : DAW.pianoroll ).getCurrentTime(),
			duration = ( DAW.compositionFocused ? DAW.composition.cmp : DAW.pianoroll ).duration,
			grid = UIcontrolsGetFocusedGrid( subject );

		DOM.playToggle.dataset.dir = onCmp ? "up" : "down";
		DOM.sliderTime.options( { max: duration || DAW.get.beatsPerMeasure() } );
		DOM.sliderTime.setValue( beat );
		UIpianoroll.rootElement.classList.toggle( "selected", !onCmp );
		UIpatternroll.rootElement.classList.toggle( "selected", onCmp );
		grid.rootElement.focus();
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
	gsuiPopup.custom( {
		title: "Tempo",
		submit: UIcontrolsTempoSubmit,
		element: DOM.tempoPopupContent,
	} );
}

function UIcontrolsTempoSubmit( data ) {
	const bpm = DAW.get.bpm(),
		bPM = DAW.get.beatsPerMeasure(),
		sPB = DAW.get.stepsPerBeat(),
		timeSignChanged = data.beatsPerMeasure !== bPM || data.stepsPerBeat !== sPB;

	if ( timeSignChanged || data.bpm !== bpm ) {
		const obj = {};

		if ( timeSignChanged ) {
			obj.beatsPerMeasure = data.beatsPerMeasure;
			obj.stepsPerBeat = data.stepsPerBeat;
		}
		if ( data.bpm !== bpm ) {
			obj.bpm = data.bpm;
		}
		DAW.compositionChange( obj );
	}
}
