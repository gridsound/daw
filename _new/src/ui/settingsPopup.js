"use strict";

ui.settingsPopup = {
	init() {
		ui.idElements.settings.onclick = ui.settingsPopup.show;
		ui.idElements.settingsPopupWrap.onclick = ui.settingsPopup.hide;
		ui.idElements.settingsPopupForm.onsubmit = ui.settingsPopup._onsubmit;
		ui.idElements.settingsPopup.onclick = function( e ) { e.stopPropagation(); };
		ui.settingsPopup.inputs = ui.idElements.settingsPopupForm.querySelectorAll( "input" );
	},
	show() {
		var inp = ui.settingsPopup.inputs;

		inp[ +settings.clockSteps ].checked = true;
		inp[ 2 ].value = gs.currCmp.name;
		inp[ 3 ].value = gs.currCmp.bpm;
		inp[ 4 ].value = gs.currCmp.beatsPerMeasure;
		inp[ 5 ].value = gs.currCmp.stepsPerBeat;
		ui.idElements.settingsPopupWrap.classList.remove( "hidden" );
	},
	hide() {
		ui.idElements.settingsPopupWrap.classList.add( "hidden" );
	},

	// private:
	_onsubmit() {
		var x, _daw = {}, _cmp = {}, _cmpRev = {},
			currCmp = gs.currCmp,
			inp = ui.settingsPopup.inputs,
			bPM = +inp[ 4 ].value,
			sPB = +inp[ 5 ].value;

		inp[ +settings.clockSteps ].checked || ( _daw.clockSteps = !settings.clockSteps );
		( x =  inp[ 2 ].value ) !== currCmp.name && ( _cmp.name = x );
		( x = +inp[ 3 ].value ) !== currCmp.bpm && ( _cmp.bpm = x );
		if ( bPM !== currCmp.beatsPerMeasure || sPB !== currCmp.stepsPerBeat ) {
			_cmp.beatsPerMeasure = bPM;
			_cmp.stepsPerBeat = sPB;
		}
		for ( x in _daw ) {
			gs.changeSettings( _daw );
			break;
		}
		for ( x in _cmp ) {
			for ( x in _cmp ) {
				_cmpRev[ x ] = currCmp[ x ];
			}
			gs.pushCompositionChange( _cmp, _cmpRev );
			break;
		}
		ui.settingsPopup.hide();
		return false;
	}
};
