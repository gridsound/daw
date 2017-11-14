"use strict";

ui.settingsPopup = {
	init() {
		dom.settingsPopupContent.remove();
		dom.settings.onclick = ui.settingsPopup.show;
		ui.settingsPopup.inputs = dom.settingsPopupContent.querySelectorAll( "input" );
		ui.settingsPopup.elBpmTap = dom.settingsPopupContent.querySelectorAll( "span" );
	},
	show() {
		var cmp = gs.currCmp,
			inp = ui.settingsPopup.inputs,
			bpmTap = ui.settingsPopup.elBpmTap[ 0 ];

		inp[ +env.clockSteps ].checked = true;
		inp[ 2 ].value = cmp.name;
		inp[ 3 ].value = cmp.bpm;
		inp[ 4 ].value = cmp.beatsPerMeasure;
		inp[ 5 ].value = cmp.stepsPerBeat;

		// BpmTap 
		bpmTap.timeBefore = 0;
		bpmTap.bpmStack = [];
		bpmTap.nbBpmToAverage = 10;
		bpmTap.onclick = ui.settingsPopup.bpmTap.bind( null, inp[ 3 ], bpmTap );

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
		( x = +inp[ 5 ].value ) !== cmp.beatsPerMeasure && ( cmpChange.beatsPerMeasure = x );
		( x = +inp[ 6 ].value ) !== cmp.stepsPerBeat && ( cmpChange.stepsPerBeat = x );
		for ( x in dawChange ) { gs.changeSettings( dawChange ); break; }
		for ( x in cmpChange ) { gs.pushCompositionChange( cmpChange ); break; }
	},

	bpmTap( inputBpm, bpmTap ) {
		lg( 1);
		var time = (new Date()).getTime();

		if ( bpmTap.timeBefore ) {
			var i, bpm = 60000 / ( time - bpmTap.timeBefore ),
				lastBpm = bpmTap.bpmStack.length ?
					bpmTap.bpmStack[ bpmTap.bpmStack.length - 1 ] : 0;
			if ( lastBpm && ( bpm < lastBpm / 1.5 || bpm > lastBpm * 1.5 ) ) {
				bpmTap.timeBefore = bpmTap.bpmStack.length = 0;
				inputBpm.value = '0';
			} else {
				bpmTap.bpmStack.push( bpm );
				for ( i = bpm = 0; i < bpmTap.bpmStack.length && i < bpmTap.nbBpmToAverage; ++i )
					bpm += bpmTap.bpmStack[ bpmTap.bpmStack.length - 1 - i ];
				inputBpm.value = Math.floor( bpm / i );
			}
		}
		bpmTap.timeBefore = time;
		return false;
	}
};
