"use strict";

class uiSynth {
	constructor() {
		const uisyn = new gsuiSynthesizer();

		this._uisyn = uisyn;
		uisyn.oninput = this._oninputSynth.bind( this );
		uisyn.onchange = this._onchangeSynth.bind( this );
		uisyn.setWaveList( Array.from( gswaPeriodicWaves.keys() ) );
		dom.synthName.onclick = this._onclickName.bind( this );
		dom.synthWrapper2.append( uisyn.rootElement );
		uisyn.attached();
	}

	empty() {
		this._uisyn.empty();
	}
	open( synth ) {
		this.empty();
		this.name( synth.name );
		this.change( synth );
	}
	name( name ) {
		dom.synthName.textContent = name;
	}
	change( obj ) {
		if ( "name" in obj ) {
			this.name( obj.name );
		}
		this._uisyn.change( obj );
	}

	// events:
	_onclickName() {
		const id = gs.currCmp.synthOpened,
			oldName = gs.currCmp.synths[ id ].name;

		gsuiPopup.prompt( "Rename synthesizer", "", oldName, "Rename" )
			.then( n => {
				if ( n !== null ) {
					const name = n.trim();

					if ( name !== oldName ) {
						gs.undoredo.change( { synths: {
							[ id ]: { name }
						} } );
					}
				}
			} );
	}
	_oninputSynth( id, attr, val ) {
		wa.synths.update( gs.currCmp.synthOpened, {
			oscillators: { [ id ]: { [ attr ]: val } }
		} );
	}
	_onchangeSynth( obj ) {
		gs.undoredo.change( { synths: { [ gs.currCmp.synthOpened ]: obj } } );
	}
}
