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
		var k, _daw = {}, _cmp = {},
			inp = ui.settingsPopup.inputs;

		inp[ +settings.clockSteps ].checked || ( _daw.clockSteps = !settings.clockSteps );
		( k =  inp[ 2 ].value ) !== gs.currCmp.name && ( _cmp.name = k );
		( k = +inp[ 3 ].value ) !== gs.currCmp.bpm && ( _cmp.bpm = k );
		( k = +inp[ 4 ].value ) !== gs.currCmp.beatsPerMeasure && ( _cmp.beatsPerMeasure = k );
		( k = +inp[ 5 ].value ) !== gs.currCmp.stepsPerBeat && ( _cmp.stepsPerBeat = k );
		for ( k in _daw ) { gs.changeSettings( _daw ); break; }
		for ( k in _cmp ) { gs.changeCompositionSettings( _cmp ); break; }
		ui.settingsPopup.hide();
		return false;
	}
};
