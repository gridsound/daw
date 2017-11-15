"use strict";

ui.synth = {
	init() {
		dom.synthOcsAdd.onclick = ui.synth._onclickAdd;
	},
	empty() {
	},
	name( name ) {
		dom.synthName.textContent = name;
	},
	change( obj ) {
	},

	// private:
	_addOsc( id ) {
	},
	_delOsc( id ) {
	},

	// events:
	_onclickName() {
		var synId = gs.currCmp.synthOpened,
			syn = gs.currCmp.synths[ synId ],
			n = prompt( "Name synthesizer :", syn.name );

		if ( n != null && ( n = n.trim() ) !== syn.name ) {
			gs.pushCompositionChange( { synths: {
				[ synId ]: { name: n }
			} } );
		}
	},
	_onclickAdd() {
	}
};
