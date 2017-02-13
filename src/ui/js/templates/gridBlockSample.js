"use strict";

function gridBlockSample( smpobj ) {
	var tpl = document.querySelector( "#gridBlockSample" ).content,
		elRoot = document.importNode( tpl, true );

	this.elWave = elRoot.querySelector( ".gsuiWaveform" );
	this.elName = elRoot.querySelector( ".name" );
	this.elCropStart = elRoot.querySelector( ".crop.start" );
	this.elCropEnd = elRoot.querySelector( ".crop.end" );
	this.uiWaveform = new gsuiWaveform( this.elWave );

	this.elName.textContent = smpobj.srcobj.metadata.name;
	Array.from( elRoot.querySelectorAll( "*" ) ).forEach( function( el ) {
		el.smpobj = smpobj;
	} );

	ui.dom.templateCloned.appendChild( elRoot );
	this.elRoot = ui.dom.templateCloned.querySelector( ".gridBlock" );
	this.elRoot.remove();
}
