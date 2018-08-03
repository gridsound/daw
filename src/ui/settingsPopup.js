"use strict";

class uiSettingsPopup {
	constructor() {
		dom.settingsPopupContent.remove();
		dom.settings.onclick = this.show.bind( this );
		this.inputs = dom.settingsPopupContent.querySelectorAll( "input" );
	}

	show() {
		const cmp = gs.currCmp,
			inp = this.inputs,
			bpmTap = dom.bpmTap;

		inp[ +env.clockSteps ].checked = true;
		inp[ 2 ].value = cmp.name;
		inp[ 3 ].value = cmp.bpm;
		inp[ 4 ].value = cmp.beatsPerMeasure;
		inp[ 5 ].value = cmp.stepsPerBeat;
		bpmTap.timeBefore = 0;
		bpmTap.bpmStack = [];
		bpmTap.nbBpmToAverage = 10;
		bpmTap.onclick = this._bpmTap.bind( null, inp[ 3 ], bpmTap );
		gsuiPopup.custom( "Settings", dom.settingsPopupContent, this._onsubmit.bind( this ) );
		return false;
	}

	// private:
	_onsubmit() {
		const cmp = gs.currCmp,
			inp = this.inputs,
			dawChange = {},
			cmpChange = {};
		let x;

		inp[ +env.clockSteps ].checked || ( dawChange.clockSteps = !env.clockSteps );
		( x =  inp[ 2 ].value ) !== cmp.name && ( cmpChange.name = x );
		( x = +inp[ 3 ].value ) !== cmp.bpm && ( cmpChange.bpm = x );
		( x = +inp[ 4 ].value ) !== cmp.beatsPerMeasure && ( cmpChange.beatsPerMeasure = x );
		( x = +inp[ 5 ].value ) !== cmp.stepsPerBeat && ( cmpChange.stepsPerBeat = x );
		for ( x in dawChange ) { gs.changeSettings( dawChange ); break; }
		for ( x in cmpChange ) { gs.undoredo.change( cmpChange ); break; }
	}
	_bpmTap( inputBpm, bpmTap ) {
		const time = Date.now();

		if ( bpmTap.timeBefore ) {
			const bpm = 60000 / ( time - bpmTap.timeBefore ),
				lastBpm = bpmTap.bpmStack.length
					? bpmTap.bpmStack[ bpmTap.bpmStack.length - 1 ]
					: 0;

			if ( lastBpm && ( bpm < lastBpm / 1.5 || bpm > lastBpm * 1.5 ) ) {
				bpmTap.timeBefore = bpmTap.bpmStack.length = 0;
				inputBpm.value = "0";
			} else {
				let i = 0,
					sum = 0;

				bpmTap.bpmStack.push( bpm );
				for ( ; i < bpmTap.bpmStack.length && i < bpmTap.nbBpmToAverage; ++i ) {
					sum += bpmTap.bpmStack[ bpmTap.bpmStack.length - 1 - i ];
				}
				inputBpm.value = Math.floor( sum / i );
			}
		}
		bpmTap.timeBefore = time;
		return false;
	}
}
