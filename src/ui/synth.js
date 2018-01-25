"use strict";

ui.synth = {
	init() {
		var uisyn = new gsuiSynthesizer();

		ui.synth._uisyn = uisyn;
		uisyn.oninput = ui.synth._oninputSynth;
		uisyn.onchange = ui.synth._onchangeSynth;
		dom.synthName.onclick = ui.synth._onclickName;
		uisyn.rootElement.querySelector( ".gsuiSynthesizer-title" ).remove();
		uisyn.rootElement.querySelector( ".gsuiSynthesizer-envelopes" ).remove();
		dom.synthWrapper2.append( uisyn.rootElement );
		uisyn.attached();
	},
	empty() {
		ui.synth._uisyn.empty();
	},
	open( synth ) {
		ui.synth.empty();
		ui.synth.name( synth.name );
		ui.synth.change( synth );
	},
	name( name ) {
		dom.synthName.textContent = name;
	},
	change( obj ) {
		if ( "name" in obj ) {
			ui.synth.name( obj.name );
		}
		ui.synth._uisyn.change( obj );
	},

	// events:
	_onclickName() {
		var cmp = gs.currCmp,
			synth = cmp.synths[ cmp.synthOpened ],
			n = prompt( "Name synthesizer :", synth.name );

		if ( n != null && ( n = n.trim() ) !== synth.name ) {
			gs.undoredo.change( { synths: { [ cmp.synthOpened ]: {
				name: n
			} } } );
		}
	},
	_oninputSynth( id, attr, val ) {
		wa.synths.update( gs.currCmp.synthOpened, {
			oscillators: { [ id ]: { [ attr ]: val } }
		} );
	},
	_onchangeSynth( obj ) {
		gs.undoredo.change( { synths: { [ gs.currCmp.synthOpened ]: obj } } );
	}
};
