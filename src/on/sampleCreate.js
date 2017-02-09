"use strict";

( function() {

waFwk.on.sampleCreate = function( smpobj ) {
	return new SampleHTML( smpobj );
};

function SampleHTML( smpobj ) {
	var elRoot = ui.createHTML( Handlebars.templates.gridBlockSample() )[ 0 ];

	this.elRoot = elRoot;
	this.elWave = elRoot.querySelector( ".gsuiWaveform" );
	this.elName = elRoot.querySelector( ".name" );
	this.elCropStart = elRoot.querySelector( ".crop.start" );
	this.elCropEnd = elRoot.querySelector( ".crop.end" );
	this.uiWaveform = new gsuiWaveform( this.elWave );
	Array.from( elRoot.querySelectorAll( "*" ) ).forEach( function( el ) {
		el.smpobj = smpobj;
	} );
}

// gs.sample.create = function( gsfile ) {
	// var smp = gs.wctx.createSample( gsfile.wbuff );
	// smp.data = {
	// 	selected: false,
	// 	gsfile: gsfile,
	// };
	// gsfile.source.used();
	// ui.sample.create( smp );
// };

} )();
