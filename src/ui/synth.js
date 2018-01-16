"use strict";

ui.synth = {
	init() {
		dom.synthName.onclick = ui.synth._onclickName;
		dom.synthOscAdd.onclick = ui.synth._onclickAddOsc;
		ui.synth._oscs = {};
	},
	empty() {
		Object.keys( ui.synth._oscs ).forEach( this._deleteOsc );
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
		"name" in obj && ui.synth.name( obj.name );
		"oscillators" in obj && Object.entries( obj.oscillators )
			.forEach( function( [ id, osc ] ) {
				osc ? this._oscs[ id ]
					? this._updateOsc( id, osc )
					: this._createOsc( id, osc )
					: this._deleteOsc( id );
			}, ui.synth );
	},

	// private:
	_createOption( type ) {
		var opt = document.createElement( "option" );

		opt.value = type;
		opt.textContent = type.replace( /_/g, " " );
		return opt;
	},
	_createOsc( id, osc ) {
		var uiosc = new gsuiOscillator();

		ui.synth._oscs[ id ] = uiosc;
		uiosc.oninput = ui.synth._oninputOsc.bind( null, id );
		uiosc.onchange = ui.synth._onchangeOsc.bind( null, id );
		uiosc.onremove = ui.synth._onremoveOsc.bind( null, id );
		uiosc.change( osc );
		uiosc.rootElement.dataset.order = osc.order;
		if ( !Array.from( dom.synthOscsList.children ).some( el => {
			if ( osc.order <= +el.dataset.order ) {
				uiosc.attach( "before", el );
				return true;
			}
		} ) ) {
			uiosc.attach( "append", dom.synthOscsList );
		}
	},
	_updateOsc( id, osc ) {
		ui.synth._oscs[ id ].change( osc );
	},
	_deleteOsc( id ) {
		ui.synth._oscs[ id ].remove();
		delete ui.synth._oscs[ id ];
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
	_onclickAddOsc() {
		gs.undoredo.change( { synths: { [ gs.currCmp.synthOpened ]: {
			oscillators: { [ common.uuid() ]: {
				type: "sine",
				detune: 0,
				gain: 1,
				pan: 0
			} }
		} } } );
		return false;
	},
	_onremoveOsc( id ) {
		gs.undoredo.change( { synths: { [ gs.currCmp.synthOpened ]: {
			oscillators: { [ id ]: null }
		} } } );
		return false;
	},
	_oninputOsc( id, attr, val ) {
		wa.synths.update( gs.currCmp.synthOpened, {
			oscillators: { [ id ]: { [ attr ]: val } }
		} );
	},
	_onchangeOsc( id, obj ) {
		gs.undoredo.change( { synths: { [ gs.currCmp.synthOpened ]: {
			oscillators: { [ id ]: obj }
		} } } );
	}
};
