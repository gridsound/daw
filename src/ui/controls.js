"use strict";

const UIclock = new gsuiClock();

function UIcontrolsCurrentTime( beat, focused ) {
	( focused === "composition" ? UIpatternroll : UIpianoroll ).currentTime( beat );
}

function UIcontrolsFocusOn( subject, b ) {
	if ( b ) {
		const onCmp = subject === "composition";

		DOM.togglePlay.classList.toggle( "after", !onCmp );
		DOM.mainGridWrap.classList.toggle( "focus", onCmp );
		DOM.keysGridWrap.classList.toggle( "focus", !onCmp );
		( onCmp ? UIpatternroll : UIpianoroll ).rootElement.focus();
	}
}

function UIcontrolsInit() {
	const slider = new gsuiSlider();

	DOM.play.onclick = () => DAW.togglePlay();
	DOM.stop.onclick = () => {
		DAW.stop();
		switch ( document.activeElement ) {
			case UIpatternroll.rootElement: DAW.compositionFocus( "-f" ); break;
			case UIpianoroll.rootElement: DAW.pianorollFocus( "-f" ); break;
		}
	};
	DOM.togglePlay.onclick = () => {
		DAW.compositionFocused
			? DAW.pianorollFocus( "-f" )
			: DAW.compositionFocus( "-f" );
		return false;
	};
	slider.oninput = v => DAW.destination.setGain( v );
	slider.options( {
		type: "linear-y",
		min: 0,
		max: 1.5,
		step: .01,
		scrollStep: .1,
		value: DAW.destination.getGain(),
		startFrom: 0,
	} );
	DOM.appGainWrap.append( slider.rootElement );
	UIclock.rootElement.classList.add( "ctrl-item" );
	DOM.stop.after( UIclock.rootElement );
	UIclock.onchangeDisplay = mode => localStorage.setItem( "gsuiClock.display", mode );
	UIclock.setDisplay( localStorage.getItem( "gsuiClock.display" ) || "second" );
	UIclock.attached();
	slider.attached();
}
