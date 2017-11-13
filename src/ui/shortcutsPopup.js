"use strict";

ui.shortcutsPopup = {
	init() {
		dom.shortcuts.onclick = ui.shortcutsPopup.show;
	},
	show() {
		var cmp = gs.currCmp;
		// 	inp = ui.shortcutsPopup.inputs;

		// inp[ +env.clockSteps ].checked = true;
		// inp[ 2 ].value = cmp.name;
		// inp[ 3 ].value = cmp.bpm;
		// inp[ 4 ].value = cmp.beatsPerMeasure;
		// inp[ 5 ].value = cmp.stepsPerBeat;
		gsuiPopup.custom( "Shortcuts", dom.shortcutsPopupContent );
		return false;
	}
};
