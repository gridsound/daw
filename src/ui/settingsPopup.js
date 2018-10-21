"use strict";

function UIsettingsPopupInit() {
	DOM.settings.onclick = UIsettingsPopupShow;
	DOM.settingsBPMTap.onclick = UIsettingsPopupBPMTap;
}

function UIsettingsPopupShow() {
	const cmp = DAW.get.composition(),
		bpmTap = DOM.settingsBPMTap;

	DOM[ DAW.env.clockSteps
		? "settingsInputClockSec"
		: "settingsInputClockBeat" ].checked = true;
	DOM.settingsInputName.value = cmp.name;
	DOM.settingsInputBPM.value = cmp.bpm;
	DOM.settingsInputBeatsPM.value = cmp.beatsPerMeasure;
	DOM.settingsInputStepsPB.value = cmp.stepsPerBeat;
	bpmTap.timeBefore = 0;
	bpmTap.bpmStack = [];
	bpmTap.nbBpmToAverage = 10;
	gsuiPopup.custom( {
		title: "Settings",
		submit: UIsettingsPopupSubmit,
		element: DOM.settingsPopupContent,
	} );
	return false;
}

function UIsettingsPopupSubmit() {
	const cmp = DAW.get.composition(),
		envChange = {},
		cmpChange = {},
		bpm = +DOM.settingsInputBPM.value,
		name = DOM.settingsInputName.value,
		beatsPM = +DOM.settingsInputBeatsPM.value,
		stepsPB = +DOM.settingsInputStepsPB.value,
		clockDisplay = DOM[ DAW.env.clockSteps
			? "settingsInputClockSec"
			: "settingsInputClockBeat" ];

	if ( !clockDisplay.checked ) { envChange.clockSteps = !DAW.env.clockSteps; }
	if ( bpm !== cmp.bpm ) { cmpChange.bpm = bpm; }
	if ( name !== cmp.name ) { cmpChange.name = name; }
	if ( stepsPB !== cmp.stepsPerBeat ) { cmpChange.stepsPerBeat = stepsPB; }
	if ( beatsPM !== cmp.beatsPerMeasure ) { cmpChange.beatsPerMeasure = beatsPM; }
	if ( !DAWCore.objectIsEmpty( envChange ) ) { DAW.envChange( envChange ); }
	if ( !DAWCore.objectIsEmpty( cmpChange ) ) { DAW.compositionChange( cmpChange ); }
}

function UIsettingsPopupBPMTap() {
	const time = Date.now(),
		bpmTap = DOM.settingsBPMTap;

	if ( bpmTap.timeBefore ) {
		const bpm = 60000 / ( time - bpmTap.timeBefore ),
			lastBpm = bpmTap.bpmStack.length
				? bpmTap.bpmStack[ bpmTap.bpmStack.length - 1 ]
				: 0;

		if ( lastBpm && ( bpm < lastBpm / 1.5 || bpm > lastBpm * 1.5 ) ) {
			bpmTap.timeBefore = bpmTap.bpmStack.length = 0;
			DOM.settingsInputBPM.value = "0";
		} else {
			let i = 0,
				sum = 0;

			bpmTap.bpmStack.push( bpm );
			for ( ; i < bpmTap.bpmStack.length && i < bpmTap.nbBpmToAverage; ++i ) {
				sum += bpmTap.bpmStack[ bpmTap.bpmStack.length - 1 - i ];
			}
			DOM.settingsInputBPM.value = Math.floor( sum / i );
		}
	}
	bpmTap.timeBefore = time;
	return false;
}
