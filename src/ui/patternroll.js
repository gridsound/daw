"use strict";

const UIpatternroll = new gsuiPatternroll();

function UIpatternrollInit() {
	const win = UIwindows.window( "main" );

	UIpatternroll.setFontSize( 32 );
	UIpatternroll.setPxPerBeat( 40 );
	UIpatternroll.onchangeCurrentTime = t => DAW.composition.setCurrentTime( t );
	UIpatternroll.rootElement.onfocus = () => DAW.compositionFocus();
	UIpatternroll.onchange = UIpatternrollOnChange;
	UIpatternroll.onaddBlock = UIpatternrollOnAddBlock;
	UIpatternroll.oneditBlock = UIpatternrollOnEditBlock;
	UIpatternroll.onchangeLoop = UIpatternrollOnChangeLoop;
	win.onresize =
	win.onresizing = () => UIpatternroll.resized();
	win.onfocusin = UIpatternrollWindowFocusin;
	win.append( UIpatternroll.rootElement );
	UIpatternroll.attached();
}

function UIpatternrollWindowFocusin( e ) {
	if ( !UIpatternroll.rootElement.contains( e.target ) ) {
		UIpatternroll.rootElement.focus();
	}
}

function UIpatternrollOnChange( obj ) {
	const dur = UIpatternroll.getBlocks().size && UIpatternroll.getDuration();

	if ( dur !== DAW.get.duration() ) {
		obj.duration = dur;
	}
	DAW.compositionChange( obj );
}

function UIpatternrollOnChangeLoop( looping, a, b ) {
	DAW.compositionChange( {
		loopA: looping && a,
		loopB: looping && b,
	} );
}

function UIpatternrollOnEditBlock( id, obj, blc ) {
	const pat = DAW.get.pattern( obj.pattern );

	switch ( pat.type ) {
		case "keys": {
			const keys = DAW.get.keys( pat.keys );

			blc._gsuiRectMatrix.render( uiKeysToRects( keys ), obj.offset, obj.duration );
		} break;
		case "buffer": {
			const svg = blc._gsuiWaveform,
				bps = DAW.get.bpm() / 60;

			if ( svg ) {
				UIwaveforms.setSVGViewbox( svg, obj.offset / bps, obj.duration / bps );
			}
		} break;
	}
}

function UIpatternrollOnAddBlock( id, obj, blc ) {
	const pat = DAW.get.pattern( obj.pattern );

	switch ( pat.type ) {
		case "keys": {
			const keys = DAW.get.keys( pat.keys ),
				mat = new gsuiRectMatrix();

			blc._gsuiRectMatrix = mat;
			mat.setResolution( 200, 32 );
			mat.render( uiKeysToRects( keys ), obj.offset, obj.duration );
			blc.children[ 3 ].append( mat.rootElement );
		} break;
		case "buffer": {
			const svg = UIwaveforms.createSVG( pat.buffer ),
				bps = DAW.get.bpm() / 60;

			if ( svg ) {
				blc._gsuiWaveform = svg;
				blc.children[ 3 ].append( svg );
				UIwaveforms.setSVGViewbox( svg, obj.offset / bps, obj.duration / bps );
			}
		} break;
	}
	blc.ondblclick = () => { DAW.openPattern( obj.pattern ); };
	blc.querySelector( ".gsuiPatternroll-block-name" ).textContent = pat.name;
}
