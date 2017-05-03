"use strict";

ui.gridblockSample = function( smpobj ) {
	var tpl = document.querySelector( "#gridblockSample" ).content,
		elRoot = document.importNode( tpl, true );

	ui.dom.templateCloned.appendChild( elRoot );
	elRoot = ui.dom.templateCloned.querySelector( ".gridblock" );
	elRoot.remove();

	this.smpobj = smpobj;
	this.elRoot = elRoot;
	this.elName = elRoot.querySelector( ".name" );
	this.elCropStart = elRoot.querySelector( ".crop.start" );
	this.elCropEnd = elRoot.querySelector( ".crop.end" );
	this.uiWaveform = new gsuiWaveform();
	elRoot.querySelector( ".content" ).appendChild( this.uiWaveform.rootElement );
	Array.from( elRoot.querySelectorAll( "*" ) ).forEach( function( el ) {
		el.smpobj = smpobj;
	} );
	this.name( smpobj.source.name );
};

ui.gridblockSample.prototype = {
	show: function() {
		this.elRoot.style.display = "block";
	},
	hide: function() {
		this.elRoot.style.display = "none";
	},
	remove: function() {
		this.elRoot.remove();
	},
	select: function( b ) {
		this.elRoot.classList.toggle( "selected", b );
	},
	name: function( name ) {
		this.elName.textContent = name;
	},
	toTrack: function( trkobj ) {
		trkobj.userData.elColLinesTrack.appendChild( this.elRoot );
	},
	when: function( when ) {
		this.elRoot.style.left = when + "em";
	},
	duration: function( dur ) {
		this.elRoot.style.width = dur + "em";
	},
	waveform: function( buf, offset, duration ) {
		var b0 = buf.getChannelData( 0 ),
			b1 = buf.numberOfChannels < 2 ? b0 : buf.getChannelData( 1 );

		offset *= 60 / waFwk.bpm;
		duration *= 60 / waFwk.bpm;
		this.uiWaveform.setResolution( ~~( duration * 1024 ), 128 );
		this.uiWaveform.draw( b0, b1, buf.duration, offset, duration );
	}
};
