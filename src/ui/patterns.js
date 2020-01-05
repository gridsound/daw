"use strict";

window.UIbuffers = new Map();
window.UIpatterns = new Map();
window.UIwaveforms = new gsuiWaveforms();
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
		UIwaveforms.add( idBuf, buf.buffer );
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
	UIupdatePatternContent( id );
	if ( obj.type === "buffer" ) {
		DOM.buffPatterns.prepend( pat );
	}
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
			svg = elBlc._gsuiWaveform;

		if ( svg ) {
			UIwaveforms.setSVGViewbox( svg, blc.offset / bps, blc.duration / bps );
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
				if ( !elPat._gsuiWaveform ) {
					const buf = UIbuffers.get( pat.buffer );

					if ( buf ) {
						const wave = new gsuiWaveform();

						wave.setResolution( 260, 48 );
						wave.drawBuffer( buf.buffer, buf.offset, buf.duration );
						elPat.querySelector( ".gsuiPatternroll-block-content" ).append( wave.rootElement );
						elPat._gsuiWaveform = wave;
					}
				}
				UIpatternroll.getBlocks().forEach( ( elBlc, blcId ) => {
					const blc = get.block( blcId );

					if ( blc.pattern === id && !elBlc._gsuiWaveform ) {
						const svg = UIwaveforms.createSVG( pat.buffer ),
							bps = get.bpm() / 60;

						if ( svg ) {
							elBlc._gsuiWaveform = svg;
							elBlc.children[ 3 ].append( svg );
							UIwaveforms.setSVGViewbox( svg, blc.offset / bps, blc.duration / bps );
						}
					}
				} );
			break;
			case "keys":
				if ( !elPat._gsuiRectMatrix ) {
					const mat = new gsuiRectMatrix();

					mat.setResolution( 200, 32 );
					elPat.querySelector( ".gsuiPatternroll-block-content" ).append( mat.rootElement );
					elPat._gsuiRectMatrix = mat;
				}
				elPat._gsuiRectMatrix.render( uiKeysToRects( get.keys( pat.keys ) ) );
				UIpatternroll.getBlocks().forEach( ( elBlc, blcId ) => {
					const blc = get.block( blcId );

					if ( blc.pattern === id ) {
						const keys = get.keys( get.pattern( blc.pattern ).keys );

						elBlc._gsuiRectMatrix.render( uiKeysToRects( keys ), blc.offset, blc.duration );
					}
				} );
				break;
		}
	}
}
