"use strict";

( function() {

waFwk.on.setBPM = function( bpm ) {
	var bInt = ~~bpm,
		bCent = Math.min( Math.round( ( bpm - bInt ) * 100 ), 99 );

	ui.dom.bpmInt.textContent = bInt < 100 ? "0" + bInt : bInt;
	ui.dom.bpmDec.textContent = bCent < 10 ? "0" + bCent : bCent;
};

waFwk.on.setBPMthen = function( bpm ) {
	ui.BPMem = bpm / 60;
	gs.composition.bpm( bpm );
	gs.composition.samples.forEach( ui.sample.duration );
	ui.clockSetTime( gs.currentTime() );
};

ui.dom.bpmInt.onwheel = wheel.bind( null, 1 );
ui.dom.bpmDec.onwheel = wheel.bind( null, .01 );
ui.dom.bpm.ondblclick = function() {
	ui.gsuiPopup.open( "prompt", "BPM", "Choose your BPM (20-999) :", waFwk.bpm )
		.then( function( bpm ) {
			+bpm && waFwk.do.setBPM( +bpm );
		} );
};

function wheel( inc, e ) {
	var dy = e.deltaY;

	e.preventDefault();
	waFwk.do.setBPM( waFwk.bpm + ( dy > 0 ? -inc : dy ? inc : 0 ), 400 );
}

} )();
