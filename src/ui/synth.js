"use strict";

ui.synth = {
	init() {
		dom.synthOsc.remove();
		dom.synthOscAdd.onclick = ui.synth._onclickAddOsc;
		ui.synth._oscHTML = {};
		ui.synth.change( {
			oscillators: {
				"000": { order: 0, type: "sine", detune:   0, pan:   0, gain: 1, },
				"001": { order: 1, type: "triangle", detune: -10, pan: -.3, gain: .6, },
				"002": { order: 2, type: "square", detune:  10, pan:  .6, gain: .3, }
			}
		} );
	},
	empty() {
	},
	load( id ) {
		var synth = gs.currCmp.synths[ id ];

		ui.synth.id = id;
		ui.synth.empty();
		ui.synth.name( synth.name );
		ui.synth.change( synth );
	},
	name( name ) {
		dom.synthName.textContent = name;
	},
	change( obj ) {
		Object.entries( obj.oscillators ).forEach( function( [ id, osc ] ) {
			osc ? this._oscHTML[ id ]
				? this._updateOsc( id, osc )
				: this._createOsc( id, osc )
				: this._deleteOsc( id );
		}, ui.synth );
	},

	// private:
	_createOsc( id, osc ) {
		var root = dom.synthOsc.cloneNode( true ),
			fn = ui.synth._initSlider.bind( null, id, osc, root ),
			curveWave = new gsuiWave();

		root.removeAttribute( "id" );
		root.querySelector( ".synthOsc-curve" ).prepend( curveWave.rootElement );
		root.querySelector( ".synthOsc-remove" ).onclick =
			ui.synth._onclickRemoveOsc.bind( null, id );
		dom.synthOscsList.append( root );
		curveWave.setResolution( 150, 20 );
		curveWave.amplitude = .5;
		curveWave.frequency = 3;
		ui.synth._oscHTML[ id ] = {
			root,
			curveWave,
			curveType: root.querySelector( ".synthOsc-curveValue" ),
			detune: fn( { min: -100, max: 100, step: .01, scrollStep: 1   }, "detune" ),
			gain:   fn( { min:    0, max:   1, step: .01, scrollStep: .03 }, "gain" ),
			pan:    fn( { min:   -1, max:   1, step: .01, scrollStep: .03 }, "pan" ),
		};
		ui.synth._updateOsc( id, osc );
	},
	_deleteOsc( id ) {
		ui.synth._oscHTML[ id ].root.remove();
		delete ui.synth._oscHTML[ id ];
	},
	_updateOsc( id, osc ) {
		var html = ui.synth._oscHTML[ id ];

		if ( osc.type ) {
			html.curveType.textContent = osc.type;
			html.curveWave.type = osc.type;
			html.curveWave.draw();
		}
		"detune" in osc && html.detune.setValue( osc.detune );
		"gain" in osc && html.gain.setValue( osc.gain );
		"pan" in osc && html.pan.setValue( osc.pan );
	},
	_initSlider( id, osc, oscRoot, obj, attr ) {
		var slider = new gsuiSlider();

		obj.type = "circular";
		obj.value = osc[ attr ];
		slider.options( obj );
		oscRoot.querySelector( `.synthOsc-${ attr } .synthOsc-sliderWrap` ).append( slider.rootElement );
		slider.oninput = ui.synth._oninputSlider.bind( null, id, slider );
		slider.onchange = ui.synth._onchangeSlider.bind( null, id, attr );
		slider.oninput( obj.value );
		slider.resized();
		return slider;
	},

	// events:
	_onclickName() {
		var syn = gs.currCmp.synths[ ui.synth.id ],
			n = prompt( "Name synthesizer :", syn.name );

		if ( n != null && ( n = n.trim() ) !== syn.name ) {
			gs.pushCompositionChange( { synths: { [ ui.synth.id ]: {
				name: n
			} } } );
		}
	},
	_oninputSlider( id, slider, val ) {
		slider.rootElement.parentNode.previousElementSibling.textContent = val;
	},
	_onchangeSlider( id, attr, val ) {
		gs.pushCompositionChange( { synths: { [ ui.synth.id ]: {
			oscillators: { [ id ]: { [ attr ]: val } }
		} } } );
	},
	_onclickAddOsc() {
		gs.pushCompositionChange( { synths: { [ ui.synth.id ]: {
			oscillators: { [ common.uuid() ]: {
				curve: "sine",
				detune: 0,
				gain: 1,
				pan: 0
			} }
		} } } );
		return false;
	},
	_onclickRemoveOsc( id ) {
		gs.pushCompositionChange( { synths: { [ ui.synth.id ]: {
			oscillators: { [ id ]: null }
		} } } );
		return false;
	}
};
