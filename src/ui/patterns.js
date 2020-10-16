"use strict";

function UIpatternsInit() {
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
