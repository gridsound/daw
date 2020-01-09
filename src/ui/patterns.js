"use strict";

window.UIbuffers = new Map();
window.UIpatterns = new Map();
window.UIsvgForms = Object.freeze( {
	keys: new gsuiKeysforms(),
	buffer: new gsuiWaveforms(),
} );
window.UIpatternsClickFns = new Map( [
	[ undefined, id => DAW.openPattern( id ) ],
	[ "remove", id => DAW.removePattern( id ) ],
	[ "clone", id => DAW.clonePattern( id ) ],
	[ "changeDest", id => UImixerOpenChanPopup( "patterns", id ) ],
] );

function UIpatternsInit() {
	const orderBuff = new gsuiReorder(),
		orderKeys = new gsuiReorder();

	DOM.buffPatterns.addEventListener( "click", UIpatternsOnclick.bind( null, "buffer" ) );
	DOM.keysPatterns.addEventListener( "click", UIpatternsOnclick.bind( null, "keys" ) );
	document.addEventListener( "drop", e => {
		DAW.dropAudioFiles( e.dataTransfer.files );
	} );
	orderBuff.setRootElement( DOM.buffPatterns );
	orderKeys.setRootElement( DOM.keysPatterns );
	orderBuff.setSelectors( {
		item: "#buffPatterns .pattern",
		handle: "#buffPatterns .pattern-grip",
		parent: "#buffPatterns"
	} );
	orderKeys.setSelectors( {
		item: "#keysPatterns .pattern",
		handle: "#keysPatterns .pattern-grip",
		parent: ".synth-patterns"
	} );
	orderBuff.onchange = UIpatternsBuffReorderChange;
	orderKeys.onchange = UIpatternsKeysReorderChange;
	orderBuff.setDataTransfert =
	orderKeys.setDataTransfert = UIpatternsDataTransfert;
}

function UIpatternsDataTransfert( elPat ) {
	const id = elPat.dataset.id;

	return `${ id }:${ DAW.get.pattern( id ).duration }`;
}

function UIpatternsBuffReorderChange() {
	const patterns = gsuiReorder.listComputeOrderChange( DOM.buffPatterns, {} );

	DAW.compositionChange( { patterns } );
}

function UIpatternsKeysReorderChange( el, indA, indB, parA, parB ) {
	if ( parA === parB ) {
		const patterns = gsuiReorder.listComputeOrderChange( parA, {} );

		DAW.compositionChange( { patterns } );
	} else {
		const synth = parB.parentNode.dataset.id,
			patId = el.dataset.id,
			patterns = { [ patId ]: { synth } },
			obj = { patterns };

		gsuiReorder.listComputeOrderChange( parA, patterns );
		gsuiReorder.listComputeOrderChange( parB, patterns );
		if ( patId === DAW.get.patternKeysOpened() ) {
			obj.synthOpened = synth;
		}
		DAW.compositionChange( obj );
	}
}

function UIpatternsBuffersLoaded( buffers ) {
	const pats = DAW.get.patterns();

	Object.entries( buffers ).forEach( ( [ idBuf, buf ] ) => {
		UIbuffers.set( idBuf, buf );
		UIsvgForms.buffer.add( idBuf, buf.buffer );
		UIpatterns.forEach( ( _elPat, idPat ) => {
			if ( pats[ idPat ].buffer === idBuf ) {
				UIupdatePatternContent( idPat );
			}
		} );
	} );
}

function UIpatternsOnclick( type, e ) {
	const pat = e.target.closest( ".pattern" );

	if ( pat ) {
		if ( type === "keys" || e.target.dataset.action ) { // tmp
			UIpatternsClickFns.get( e.target.dataset.action )( pat.dataset.id );
		}
	}
}

function UIaddPattern( id, obj ) {
	const pat = DOM.pattern.cloneNode( true );

	pat.dataset.id = id;
	UIpatterns.set( id, pat );
	UIupdatePattern( id, obj );
	switch ( obj.type ) {
		case "buffer": DOM.buffPatterns.prepend( pat ); break;
		case "drums": DOM.drumPatterns.prepend( pat ); break;
		case "keys": // 1.
			UIsvgForms.keys.add( obj.keys );
			pat._gsuiSVGform = UIsvgForms.keys.createSVG( obj.keys );
			pat.querySelector( ".gsuiPatternroll-block-content" ).append( pat._gsuiSVGform );
			break;
	}
	UIupdatePatternContent( id );
}

function UIupdatePattern( id, obj ) {
	if ( obj.synth ) {
		UIchangePatternSynth( id, obj.synth );
	}
	if ( "order" in obj ) {
		UIpatterns.get( id ).dataset.order = obj.order;
	}
	if ( "name" in obj ) {
		UInamePattern( id, obj.name );
	}
	if ( "dest" in obj ) {
		UIpatterns.get( id ).querySelector( ".pattern-dest" )
			.textContent = DAW.get.channel( obj.dest ).name;
	}
	if ( "duration" in obj && !DAW.compositionFocused && id === DAW.get.patternKeysOpened() ) {
		DOM.sliderTime.options( { max: obj.duration } );
	}
}

function UInamePattern( id, name ) {
	UIpatterns.get( id ).querySelector( ".pattern-name" ).textContent = name;
	UIpatternroll.getBlocks().forEach( blc => {
		if ( blc.dataset.pattern === id ) {
			blc.querySelector( ".gsuiPatternroll-block-name" ).textContent = name;
		}
	} );
	if ( id === DAW.get.patternKeysOpened() ) {
		DOM.pianorollName.textContent = name;
	}
}

function UIchangePatternSynth( patId, synthId ) {
	UIsynths.get( synthId ).root.querySelector( ".synth-patterns" )
		.append( UIpatterns.get( patId ) );
}

function UIupdatePatternsBPM( bpm ) {
	const bps = bpm / 60;

	UIpatternroll.getBlocks().forEach( ( elBlc, blcId ) => {
		const blc = DAW.get.block( blcId ),
			pat = DAW.get.pattern( blc.pattern ),
			svg = elBlc._gsuiSVGform;

		if ( svg && pat.type === "buffer" ) {
			UIsvgForms.buffer.setSVGViewbox( svg, blc.offset, blc.duration, bps );
		}
	} );
}

function UIupdatePatternContent( id ) {
	const get = DAW.get,
		pat = get.pattern( id ),
		elPat = UIpatterns.get( id );

	if ( elPat ) {
		switch ( pat.type ) {
			case "buffer":
				if ( !elPat._gsuiSVGform ) {
					const buf = UIbuffers.get( pat.buffer );

					if ( buf ) {
						const wave = new gsuiWaveform();

						wave.setResolution( 260, 48 );
						wave.drawBuffer( buf.buffer, buf.offset, buf.duration );
						elPat.querySelector( ".gsuiPatternroll-block-content" ).append( wave.rootElement );
						elPat._gsuiSVGform = wave;
					}
				}
				UIpatternroll.getBlocks().forEach( ( elBlc, blcId ) => {
					const blc = get.block( blcId );

					if ( blc.pattern === id && !elBlc._gsuiSVGform ) {
						const svg = UIsvgForms.buffer.createSVG( pat.buffer );

						if ( svg ) {
							elBlc._gsuiSVGform = svg;
							elBlc.children[ 3 ].append( svg );
							UIsvgForms.buffer.setSVGViewbox( svg, blc.offset, blc.duration, get.bpm() / 60 );
						}
					}
				} );
				break;
			case "keys": {
				const keys = get.keys( pat.keys );

				UIsvgForms.keys.update( pat.keys, keys, pat.duration );
				UIsvgForms.keys.setSVGViewbox( elPat._gsuiSVGform, 0, 200 );
				UIpatternroll.getBlocks().forEach( ( elBlc, blcId ) => {
					const blc = get.block( blcId );

					if ( blc.pattern === id ) {
						UIsvgForms.keys.setSVGViewbox( elPat._gsuiSVGform, blc.offset, blc.duration );
					}
				} );
			} break;
		}
	}
}

/*
1. The keys pattern are append with the `synth` attribute.
*/
