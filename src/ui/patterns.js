"use strict";

window.UIpatterns = new Map();

function UIaddPattern( id, obj ) {
	const pat = DOM.pattern.cloneNode( true );

	pat.dataset.id = id;
	UIpatterns.set( id, pat );
	UInamePattern( id, obj.name );
	UIchangePatternSynth( id, obj.synth );
}

function UInamePattern( id, name ) {
	UIpatterns.get( id ).querySelector( ".pattern-name" ).textContent = name;
	UIpatternroll.getBlocks().forEach( blc => {
		if ( blc.dataset.pattern === id ) {
			blc.children[ 2 ].textContent = name;
		}
	} );
	if ( id === DAW.get.patternOpened() ) {
		DOM.pianorollName.textContent = name;
	}
}

function UIchangePatternSynth( patId, synthId ) {
	UIsynths.get( synthId ).querySelector( ".synth-patterns" )
		.prepend( UIpatterns.get( patId ) );
}

function UIupdatePatternContent( id ) {
	const get = DAW.get,
		elPat = UIpatterns.get( id );

	if ( !elPat._gsuiRectMatrix ) {
		const mat = new gsuiRectMatrix();

		mat.setResolution( 200, 32 );
		elPat._gsuiRectMatrix = mat;
		elPat.querySelector( ".pattern-content" ).append( mat.rootElement );
	}
	elPat._gsuiRectMatrix.render( uiKeysToRects( get.keys( get.pattern( id ).keys ) ) );
	UIpatternroll.getBlocks().forEach( ( elBlc, blcId ) => {
		const blc = get.block( blcId );

		if ( blc.pattern === id ) {
			const keys = get.keys( get.pattern( blc.pattern ).keys );

			elBlc._gsuiRectMatrix.render( uiKeysToRects( keys ), blc.offset, blc.duration );
		}
	} );
}

function UIpatternsInit() {
	const fnClick = new Map( [
			[ undefined, id => DAW.openPattern( id ) ],
			[ "remove", id => DAW.removePattern( id ) ],
			[ "clone", id => DAW.clonePattern( id ) ],
		] );

	DOM.pattern.remove();
	DOM.pattern.removeAttribute( "id" );
	DOM.patterns.addEventListener( "click", e => {
		const pat = e.target.closest( ".pattern" );

		if ( pat ) {
			fnClick.get( e.target.dataset.action )( pat.dataset.id );
		}
	} );
	DOM.patterns.ondragstart = e => {
		const pat = e.target.closest( ".pattern" );

		if ( pat ) {
			const id = pat.dataset.id,
				dur = DAW.get.pattern( id ).duration;

			e.dataTransfer.setData( "text", `${ id }:${ dur }` );
		}
	};
}
