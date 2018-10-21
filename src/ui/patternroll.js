"use strict";

const UIpatternroll = new gsuiPatternroll();

function UIpatternrollInit() {
	const grid = UIpatternroll;

	grid.setFontSize( 32 );
	grid.setPxPerBeat( 40 );
	grid.onchangeCurrentTime = t => DAW.composition.setCurrentTime( t );
	grid.rootElement.onfocus = () => DAW.compositionFocus();
	grid.onchange = obj => {
		const dur = UIpatternroll.getBlocks().size &&
			UIpatternroll.getDuration();

		if ( dur !== DAW.get.duration() ) {
			obj.duration = dur;
		}
		DAW.compositionChange( obj );
	}
	grid.onchangeLoop = ( looping, a, b ) => {
		DAW.compositionChange( {
			loopA: looping && a,
			loopB: looping && b,
		} );
	};
	grid.oneditBlock = ( id, obj, blc ) => {
		const pat = DAW.get.pattern( obj.pattern ),
			keys = DAW.get.keys( pat.keys );

		blc._gsuiRectMatrix.render( uiKeysToRects( keys ), obj.offset, obj.duration );
	};
	grid.onaddBlock = ( id, obj, blc ) => {
		const pat = DAW.get.pattern( obj.pattern ),
			keys = DAW.get.keys( pat.keys ),
			mat = new gsuiRectMatrix();

		blc._gsuiRectMatrix = mat;
		mat.setResolution( 200, 32 );
		mat.render( uiKeysToRects( keys ), obj.offset, obj.duration );
		blc.ondblclick = () => { DAW.openPattern( obj.pattern ); };
		blc.children[ 2 ].textContent = pat.name;
		blc.children[ 3 ].append( mat.rootElement );
	};
	DOM.mainGridWrap.append( grid.rootElement );
	grid.attached();
}
