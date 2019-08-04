"use strict";

window.UIbuffers = new Map();
window.UIpatterns = new Map();
window.UIwaveforms = new gsuiWaveforms();
window.UIpatternsClickFns = new Map( [
	[ undefined, id => DAW.openPattern( id ) ],
	[ "remove", id => DAW.removePattern( id ) ],
	[ "clone", id => DAW.clonePattern( id ) ],
] );

function UIpatternsInit() {
	UIwaveforms.setPxHeight( 48 );
	UIwaveforms.setPxPerSecond( 48 );
	DOM.buffPatterns.addEventListener( "click", UIpatternsOnclick.bind( null, "buffer" ) );
	DOM.keysPatterns.addEventListener( "click", UIpatternsOnclick.bind( null, "keys" ) );
	DOM.buffPatterns.addEventListener( "dragstart", UIpatternsOndragstart );
	DOM.keysPatterns.addEventListener( "dragstart", UIpatternsOndragstart );
	document.addEventListener( "drop", e => {
		DAW.dropAudioFiles( e.dataTransfer.files );
	} );
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

function UIpatternsOndragstart( e ) {
	const pat = e.target.closest( ".pattern" );

	if ( pat ) {
		const id = pat.dataset.id,
			dur = DAW.get.pattern( id ).duration;

		e.dataTransfer.setData( "text", `${ id }:${ dur }` );
	}
}

function UIaddPattern( id, obj ) {
	const pat = DOM.pattern.cloneNode( true );

	pat.dataset.id = id;
	UIpatterns.set( id, pat );
	UInamePattern( id, obj.name );
	switch ( obj.type ) {
		case "keys":
			UIchangePatternSynth( id, obj.synth );
			break;
		case "buffer":
			DOM.buffPatterns.prepend( pat );
			break;
	}
	UIupdatePatternContent( id );
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
	UIsynths.get( synthId ).querySelector( ".synth-patterns" )
		.prepend( UIpatterns.get( patId ) );
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
						elPat.children[ 1 ].append( wave.rootElement );
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
					elPat.children[ 1 ].append( mat.rootElement );
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
