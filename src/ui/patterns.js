"use strict";

window.UIbuffers = new Map();
window.UIpatterns = new Map();
window.UIsvgForms = Object.freeze( {
	keys: new gsuiKeysforms(),
	drums: new gsuiDrumsforms(),
	buffer: new gsuiWaveforms(),
	bufferHD: new gsuiWaveforms(),
} );
window.UIpatternsClickFns = new Map( [
	[ undefined, id => DAW.openPattern( id ) ],
	[ "remove", id => DAW.callAction( "removePattern", id ) ],
	[ "clone", id => DAW.callAction( "clonePattern", id ) ],
	[ "changeDest", id => UImixerOpenChanPopup( "pattern", id ) ],
] );

function UIpatternsInit() {
	const orderBuff = new gsuiReorder(),
		orderDrums = new gsuiReorder(),
		orderKeys = new gsuiReorder();

	window.UIsvgForms.bufferHD.hdMode( true );
	window.UIsvgForms.bufferHD.setDefaultViewbox( 260, 48 );
	DOM.drumsNew.onclick = () => DAW.callAction( "addPatternDrums" );
	DOM.buffPatterns.addEventListener( "click", UIpatternsOnclick.bind( null, "buffer" ) );
	DOM.keysPatterns.addEventListener( "click", UIpatternsOnclick.bind( null, "keys" ) );
	DOM.drumsPatterns.addEventListener( "click", UIpatternsOnclick.bind( null, "drums" ) );
	document.addEventListener( "drop", e => {
		DAW.dropAudioFiles( e.dataTransfer.files );
	} );
	orderBuff.setRootElement( DOM.buffPatterns );
	orderKeys.setRootElement( DOM.keysPatterns );
	orderDrums.setRootElement( DOM.drumsPatterns );
	orderBuff.setSelectors( {
		item: "#buffPatterns .pattern",
		handle: "#buffPatterns .pattern-grip",
		parent: "#buffPatterns"
	} );
	orderDrums.setSelectors( {
		item: "#drumsPatterns .pattern",
		handle: "#drumsPatterns .pattern-grip",
		parent: "#drumsPatterns"
	} );
	orderKeys.setSelectors( {
		item: "#keysPatterns .pattern",
		handle: "#keysPatterns .pattern-grip",
		parent: ".synth-patterns"
	} );
	orderBuff.onchange = UIpatternsReorderChange.bind( null, DOM.buffPatterns );
	orderDrums.onchange = UIpatternsReorderChange.bind( null, DOM.drumsPatterns );
	orderKeys.onchange = UIpatternsKeysReorderChange;
	orderBuff.setDataTransfert =
	orderKeys.setDataTransfert =
	orderDrums.setDataTransfert = UIpatternsDataTransfert;
}

function UIpatternsDataTransfert( elPat ) {
	const id = elPat.dataset.id;

	return `${ id }:${ DAW.get.pattern( id ).duration }`;
}

function UIpatternsReorderChange( el ) {
	const patterns = gsuiReorder.listComputeOrderChange( el, {} );

	DAW.compositionChange( { patterns } );
}

function UIpatternsKeysReorderChange( el, indA, indB, parA, parB ) {
	const patId = el.dataset.id,
		pat = DAW.get.pattern( patId );

	if ( parA === parB ) {
		const patterns = gsuiReorder.listComputeOrderChange( parA, {} );

		DAW.compositionChange(
			{ patterns },
			[ "patterns", "reorderPattern", pat.type, pat.name ]
		);
	} else {
		const synth = parB.parentNode.dataset.id,
			synName = DAW.get.synth( synth ).name,
			patterns = { [ patId ]: { synth } },
			obj = { patterns };

		gsuiReorder.listComputeOrderChange( parA, patterns );
		gsuiReorder.listComputeOrderChange( parB, patterns );
		if ( patId === DAW.get.patternKeysOpened() ) {
			obj.synthOpened = synth;
		}
		DAW.compositionChange(
			obj,
			[ "patterns", "redirectPatternKeys", pat.name, synName ]
		);
	}
}

function UIpatternsBuffersLoaded( buffers ) {
	const pats = DAW.get.patterns();

	Object.entries( buffers ).forEach( ( [ idBuf, buf ] ) => {
		UIbuffers.set( idBuf, buf );
		UIsvgForms.buffer.update( idBuf, buf.buffer );
		UIsvgForms.bufferHD.update( idBuf, buf.buffer );
		UIpatterns.forEach( ( _elPat, idPat ) => {
			if ( pats[ idPat ].buffer === idBuf ) {
				UIupdatePatternContent( idPat );
			}
		} );
	} );
	UIpatternroll.getBlocks().forEach( ( elBlc, blcId ) => {
		const blc = DAW.get.block( blcId ),
			pat = DAW.get.pattern( blc.pattern );

		if ( pat.type === "buffer" && pat.buffer in buffers ) {
			UIsvgForms.buffer.setSVGViewbox( elBlc._gsuiSVGform, blc.offset, blc.duration, DAW.get.bpm() / 60 );
		}
	} );
}

function UIpatternsOnclick( type, e ) {
	const pat = e.target.closest( ".pattern" );

	if ( pat ) {
		UIpatternsClickFns.get( e.target.dataset.action )( pat.dataset.id );
	}
}

function UIaddPattern( id, obj ) {
	const pat = DOM.pattern.cloneNode( true );

	pat.dataset.id = id;
	UIpatterns.set( id, pat );
	UIupdatePattern( id, obj );
	switch ( obj.type ) {
		case "buffer":
			UIsvgForms.buffer.add( obj.buffer );
			UIsvgForms.bufferHD.add( obj.buffer );
			pat._gsuiSVGform = window.UIsvgForms.bufferHD.createSVG( obj.buffer );
			pat.querySelector( ".gsuiPatternroll-block-content" ).append( pat._gsuiSVGform );
			DOM.buffPatterns.prepend( pat );
			break;
		case "drums":
			UIsvgForms.drums.add( obj.drums );
			pat._gsuiSVGform = UIsvgForms.drums.createSVG( obj.drums );
			pat.querySelector( ".gsuiPatternroll-block-content" ).append( pat._gsuiSVGform );
			DOM.drumsPatterns.prepend( pat );
			break;
		case "keys": // 1.
			UIsvgForms.keys.add( obj.keys );
			pat._gsuiSVGform = UIsvgForms.keys.createSVG( obj.keys );
			pat.querySelector( ".gsuiPatternroll-block-content" ).append( pat._gsuiSVGform );
			break;
	}
	UIupdatePatternContent( id );
}

function UIremovePattern( id, pat ) {
	const type = pat.type;

	if ( type === "keys" || type === "drums" ) {
		UIsvgForms[ type ].delete( pat[ type ] );
	}
	UIpatterns.get( id ).remove();
	UIpatterns.delete( id );
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
		UIredirectPattern( id, obj.dest );
	}
	if ( "duration" in obj && DAW.getFocusedName() === "pianoroll" && id === DAW.get.patternKeysOpened() ) {
		DOM.sliderTime.options( { max: obj.duration } );
	}
}

function UIredirectPattern( id, dest ) {
	const elPat = UIpatterns.get( id );

	if ( elPat ) {
		elPat.querySelector( ".pattern-dest" ).textContent = DAW.get.channel( dest ).name;
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
	if ( id === DAW.get.patternDrumsOpened() ) {
		DOM.drumsName.textContent = name;
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

function UIupdatePatternContent( patId ) {
	const get = DAW.get,
		pat = get.pattern( patId ),
		elPat = UIpatterns.get( patId );

	if ( elPat ) {
		const type = pat.type,
			id = pat[ type ];

		if ( type === "keys" ) {
			UIsvgForms.keys.update( id, get.keys( id ), pat.duration );
		} else if ( type === "drums" ) {
			UIsvgForms.drums.update( id, get.drums( id ), get.drumrows(), pat.duration, get.stepsPerBeat() );
		} else if ( type === "buffer" ) {
			const buf = UIbuffers.get( pat.buffer );

			if ( buf ) {
				UIsvgForms.buffer.update( id, buf.buffer );
				UIsvgForms.bufferHD.update( id, buf.buffer );
			}
		}
		if ( type !== "buffer" ) {
			UIsvgForms[ type ].setSVGViewbox( elPat._gsuiSVGform, 0, pat.duration );
		}
	}
}

/*
1. The keys pattern are append with the `synth` attribute.
*/
