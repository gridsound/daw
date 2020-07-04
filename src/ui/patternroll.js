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
	DAW.callAction( "changeTracksAndBlocks", obj );
}

function UIpatternrollOnChangeLoop( looping, a, b ) {
	DAW.callAction( "changeLoop", looping && a, looping && b );
}

function UIpatternrollOnEditBlock( _id, obj, blc ) {
	if ( blc._gsuiSVGform ) {
		const pat = DAW.get.pattern( obj.pattern );

		UIpatterns.svgForms[ pat.type ].setSVGViewbox( blc._gsuiSVGform, obj.offset, obj.duration, DAW.get.bpm() / 60 );
	}
}

function UIpatternrollOnAddBlock( id, obj, blc ) {
	const pat = DAW.get.pattern( obj.pattern ),
		SVGs = UIpatterns.svgForms[ pat.type ],
		svg = SVGs.createSVG( obj.pattern );

	blc._gsuiSVGform = svg;
	blc.children[ 3 ].append( svg );
	SVGs.setSVGViewbox( svg, obj.offset, obj.duration, DAW.get.bpm() / 60 );
	blc.ondblclick = () => DAW.callAction( "openPattern", obj.pattern );
	blc.querySelector( ".gsuiPatternroll-block-name" ).textContent = pat.name;
}
