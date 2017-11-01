"use strict";

ui.settingsPopup = {
	init() {
		dom.settings.onclick = ui.settingsPopup.show;
		ui.settingsPopup.inputs = dom.settingsPopupContent.querySelectorAll( "input" );
	},
	show() {
		var cmp = gs.currCmp,
			inp = ui.settingsPopup.inputs;

		inp[ +env.clockSteps ].checked = true;
		inp[ 2 ].value = cmp.name;
		inp[ 3 ].value = cmp.bpm;
		inp[ 4 ].value = cmp.beatsPerMeasure;
		inp[ 5 ].value = cmp.stepsPerBeat;
		gsuiPopup.custom( "Settings", dom.settingsPopupContent, ui.settingsPopup._onsubmit );
		return false;
	},

	// private:
	_onsubmit() {
		var x,
			dawChange = {},
			cmpChange = {},
			cmp = gs.currCmp,
			inp = ui.settingsPopup.inputs;

		inp[ +env.clockSteps ].checked || ( dawChange.clockSteps = !env.clockSteps );
		( x =  inp[ 2 ].value ) !== cmp.name && ( cmpChange.name = x );
		( x = +inp[ 3 ].value ) !== cmp.bpm && ( cmpChange.bpm = x );
		( x = +inp[ 4 ].value ) !== cmp.beatsPerMeasure && ( cmpChange.beatsPerMeasure = x );
		( x = +inp[ 5 ].value ) !== cmp.stepsPerBeat && ( cmpChange.stepsPerBeat = x );
		for ( x in dawChange ) { gs.changeSettings( dawChange ); break; }
		for ( x in cmpChange ) { gs.pushCompositionChange( cmpChange ); break; }
	}
};
