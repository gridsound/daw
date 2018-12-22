"use strict";

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

function UIcontrolsClockUpdate( a, b, c ) {
	DOM.clockMin.textContent = a;
	DOM.clockSec.textContent = b;
	DOM.clockMs.textContent  = c;
}

function UIcontrolsInit() {
	const slider = new gsuiSlider();

	DOM.play.onclick = () => ( DAW.togglePlay(), false );
	DOM.stop.onclick = () => {
		DAW.stop();
		switch ( document.activeElement ) {
			case UIpatternroll.rootElement: DAW.compositionFocus( "-f" ); break;
			case UIpianoroll.rootElement: DAW.pianorollFocus( "-f" ); break;
		}
		return false;
	};
	DOM.togglePlay.onclick = () => (
		DAW.compositionFocused
			? DAW.pianorollFocus( "-f" )
			: DAW.compositionFocus( "-f" ),
		false
	);
	slider.oninput = v => DAW.destination.gain( v );
	slider.options( {
		type: "linear-y",
		min: 0,
		max: 1.5,
		step: .01,
		scrollStep: .1,
		value: DAW.env.def_appGain,
		startFrom: 0,
	} );
	DOM.appGainWrap.append( slider.rootElement );
	slider.attached();
}
