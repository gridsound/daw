"use strict";

function UIpatternsInit() {
	const orderBuff = new gsuiReorder({
		rootElement: DOM.buffPatterns,
		itemSelector: "#buffPatterns .pattern",
		handleSelector: "#buffPatterns .pattern-grip",
		parentSelector: "#buffPatterns"
	}),
		orderDrums = new gsuiReorder({
			rootElement: DOM.keysPatterns,
			itemSelector: "#drumsPatterns .pattern",
			handleSelector: "#drumsPatterns .pattern-grip",
			parentSelector: "#drumsPatterns"
		}),
		orderKeys = new gsuiReorder({
			rootElement: DOM.drumsPatterns,
			itemSelector: "#keysPatterns .pattern",
			handleSelector: "#keysPatterns .pattern-grip",
			parentSelector: ".synth-patterns"
		});

	window.UIsvgForms.bufferHD.hdMode( true );
	window.UIsvgForms.bufferHD.setDefaultViewbox( 260, 48 );
	DOM.drumsNew.onclick = () => DAW.callAction( "addPatternDrums" );
	DOM.buffPatterns.addEventListener( "click", UIpatternsOnclick.bind( null, "buffer" ) );
	DOM.keysPatterns.addEventListener( "click", UIpatternsOnclick.bind( null, "keys" ) );
	DOM.drumsPatterns.addEventListener( "click", UIpatternsOnclick.bind( null, "drums" ) );
	document.addEventListener( "drop", e => {
		DAW.dropAudioFiles( e.dataTransfer.files );
	} );
	// orderBuff.onchange = UIpatternsReorderChange.bind( null, DOM.buffPatterns );
	// orderDrums.onchange = UIpatternsReorderChange.bind( null, DOM.drumsPatterns );
	// orderKeys.onchange = UIpatternsKeysReorderChange;
	// orderBuff.setDataTransfert =
	// orderKeys.setDataTransfert =
	// orderDrums.setDataTransfert = UIpatternsDataTransfert;
}

function UIpatternsDataTransfert( elPat ) {
	const id = elPat.dataset.id;
	const win = UIwindows.window( "blocks" );

	UIpatterns.setDAWCore( DAW );
	win.append( UIpatterns.rootElement );
	gsuiPatterns.selectChanPopupContent.classList.add( "popup" );
}

function UIpatternsBuffersLoaded( buffers ) {
	UIpatterns.bufferLoaded( buffers );
	UIpatternroll.getBlocks().forEach( ( elBlc, blcId ) => {
		const blc = DAW.get.block( blcId ),
			pat = DAW.get.pattern( blc.pattern );

		if ( pat.type === "buffer" && pat.buffer in buffers ) {
			UIpatterns.svgForms.buffer.setSVGViewbox( elBlc._gsuiSVGform, blc.offset, blc.duration, DAW.get.bpm() / 60 );
		}
	} );
}

function UIupdatePattern( id, obj ) {
	if ( obj ) {
		if ( "duration" in obj ) {
			const foc = DAW.getFocusedName();

			if ( ( foc === "pianoroll" && id === DAW.get.patternKeysOpened() ) ||
				( foc === "drums" && id === DAW.get.patternDrumsOpened() )
			) {
				DOM.sliderTime.setAttribute( "max", obj.duration );
			}
		}
		if ( "name" in obj ) {
			const name = obj.name;

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
	}
}

function UIupdatePatternsBPM( bpm ) {
	const bps = bpm / 60;

	UIpatternroll.getBlocks().forEach( ( elBlc, blcId ) => {
		const blc = DAW.get.block( blcId ),
			pat = DAW.get.pattern( blc.pattern ),
			svg = elBlc._gsuiSVGform;

		if ( svg && pat.type === "buffer" ) {
			UIpatterns.svgForms.buffer.setSVGViewbox( svg, blc.offset, blc.duration, bps );
		}
	} );
}
