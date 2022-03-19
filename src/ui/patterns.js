"use strict";

function UIpatternsInit() {
	const win = UIwindows.window( "blocks" );

	UIpatterns.setDAWCore( DAW );
	win.contentAppend( UIpatterns.rootElement );
	gsuiPatterns.selectChanPopupContent.classList.add( "popup" );
}

function UIpatternsBuffersLoaded( buffers ) {
	const patSli = DAW.get.pattern( DAW.get.opened( "slices" ) );
	const sliBuf = patSli?.source && DAW.get.pattern( patSli.source ).buffer;

	if ( sliBuf in buffers ) {
		UIslicer.rootElement.setBuffer( buffers[ sliBuf ].buffer );
	}
	UIpatterns.bufferLoaded( buffers );
	UIpatternroll.rootElement.getBlocks().forEach( ( elBlc, blcId ) => {
		const blc = DAW.get.block( blcId ),
			pat = DAW.get.pattern( blc.pattern );

		if ( pat.type === "buffer" && pat.buffer in buffers ) {
			const bpm = pat.bufferBpm || DAW.get.bpm();

			GSUI.setAttribute( elBlc, "data-missing", false );
			UIpatterns.svgForms.buffer.setSVGViewbox( elBlc._gsuiSVGform, blc.offset, blc.duration, bpm / 60 );
		}
	} );
}

function UIupdatePattern( id, obj ) {
	if ( obj ) {
		if ( "duration" in obj ) {
			const foc = DAW.getFocusedName();

			if ( foc !== "composition" && id === DAW.get.opened( foc ) ) {
				GSUI.setAttribute( UIdaw, "duration", obj.duration );
			}
		}
		if ( "name" in obj ) {
			const name = obj.name;

			UIpatternroll.rootElement.getBlocks().forEach( blc => {
				if ( blc.dataset.pattern === id ) {
					blc.querySelector( ".gsuiPatternroll-block-name" ).textContent = name;
				}
			} );
			if ( id === DAW.get.opened( "slices" ) ) {
				DOM.slicesName.textContent = name;
			}
			if ( id === DAW.get.opened( "keys" ) ) {
				DOM.pianorollName.textContent = name;
			}
			if ( id === DAW.get.opened( "drums" ) ) {
				DOM.drumsName.textContent = name;
			}
		}
	}
}
