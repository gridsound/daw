"use strict";

ui.synth = {
	init() {
		dom.synthOsc.remove();
		dom.synthName.onclick = ui.synth._onclickName;
		dom.synthOscAdd.onclick = ui.synth._onclickAddOsc;
		ui.synth._oscHTML = {};
	},
	empty() {
		Object.keys( ui.synth._oscHTML ).forEach( this._deleteOsc );
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
				osc ? this._oscHTML[ id ]
					? this._updateOsc( id, osc )
					: this._createOsc( id, osc )
					: this._deleteOsc( id );
			}, ui.synth );
	},

	// private:
	_createOsc( id, osc ) {
		var root = dom.synthOsc.cloneNode( true ),
			fn = ui.synth._sliderInit.bind( null, id, osc, root ),
			curveWave = new gsuiWave(),
			curveSelect = root.querySelector( ".synthOsc-curveSelect" );

		root.removeAttribute( "id" );
		root.dataset.order = osc.order || 0;
		root.querySelector( ".synthOsc-curve" ).prepend( curveWave.rootElement );
		curveSelect.onchange = ui.synth._onchangeCurve.bind( null, id );
		root.querySelector( ".synthOsc-remove" ).onclick =
			ui.synth._onclickRemoveOsc.bind( null, id );
		curveWave.setResolution( 150, 20 );
		curveWave.amplitude = .5;
		curveWave.frequency = 2;
		if ( !Array.from( dom.synthOscsList.children ).some( elOsc => {
			if ( osc.order <= +elOsc.dataset.order ) {
				dom.synthOscsList.insertBefore( root, elOsc );
				return true;
			}
		} ) ) {
			dom.synthOscsList.append( root );
		}
		ui.synth._oscHTML[ id ] = {
			root,
			curveWave,
			curveSelect,
			detune: fn( { min: -100, max: 100, step: 5,   scrollStep: 10  }, "detune" ),
			gain:   fn( { min:    0, max:   1, step: .01, scrollStep: .05 }, "gain" ),
			pan:    fn( { min:   -1, max:   1, step: .01, scrollStep: .1  }, "pan" ),
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
			html.curveSelect.value =
			html.curveWave.type = osc.type;
			html.curveWave.draw();
		}
		"detune" in osc && ui.synth._sliderSetValue( id, "detune", osc.detune );
		"gain" in osc && ui.synth._sliderSetValue( id, "gain", osc.gain );
		"pan" in osc && ui.synth._sliderSetValue( id, "pan", osc.pan );
	},
	_sliderInit( id, osc, oscRoot, obj, attr ) {
		var slider = new gsuiSlider(),
			sliderPar = oscRoot.querySelector( `.synthOsc-${ attr }` ),
			valElem = sliderPar.querySelector( ".synthOsc-sliderValue" );

		obj.type = "circular";
		obj.value = osc[ attr ];
		slider.options( obj );
		sliderPar.querySelector( ".synthOsc-sliderWrap" ).append( slider.rootElement );
		slider.oninput = ui.synth._oninputSlider.bind( null, id, attr, slider );
		slider.onchange = ui.synth._onchangeSlider.bind( null, id, attr );
		slider._valueElement = valElem;
		valElem.textContent = obj.value;
		slider.resized();
		return slider;
	},
	_sliderSetValue( oscId, attr, val ) {
		var slider = ui.synth._oscHTML[ oscId ][ attr ];

		slider.setValue( val );
		slider._valueElement.textContent = val;
	},

	// events:
	_onclickName() {
		var cmp = gs.currCmp,
			synth = cmp.synths[ cmp.synthOpened ],
			n = prompt( "Name synthesizer :", synth.name );

		if ( n != null && ( n = n.trim() ) !== synth.name ) {
			gs.pushCompositionChange( { synths: { [ cmp.synthOpened ]: {
				name: n
			} } } );
		}
	},
	_onchangeCurve( id, e ) {
		gs.pushCompositionChange( { synths: { [ gs.currCmp.synthOpened ]: {
			oscillators: { [ id ]: { type: e.target.value } }
		} } } );
	},
	_oninputSlider( id, attr, slider, val ) {
		wa.synths.update( gs.currCmp.synthOpened, {
			oscillators: { [ id ]: { [ attr ]: val } }
		} );
		slider._valueElement.textContent = val;
	},
	_onchangeSlider( id, attr, val ) {
		gs.pushCompositionChange( { synths: { [ gs.currCmp.synthOpened ]: {
			oscillators: { [ id ]: { [ attr ]: val } }
		} } } );
	},
	_onclickAddOsc() {
		gs.pushCompositionChange( { synths: { [ gs.currCmp.synthOpened ]: {
			oscillators: { [ common.uuid() ]: {
				type: "sine",
				detune: 0,
				gain: 1,
				pan: 0
			} }
		} } } );
		return false;
	},
	_onclickRemoveOsc( id ) {
		gs.pushCompositionChange( { synths: { [ gs.currCmp.synthOpened ]: {
			oscillators: { [ id ]: null }
		} } } );
		return false;
	}
};
