"use strict";

( function() {

waFwk.on.addSource = function( srcObj ) {
	var source = new Source(),
		file = srcObj.metadata._file,
		that = {
			source: source,
			id: gs.files.length,
			wbuff: gs.wctx.createBuffer(),
			isLoaded: false,
			isLoading: false,
			nbSamples: 0,
			samplesToSet: [],
			file: srcObj.data,
			bufferDuration: srcObj.data ? null : file[ 3 ],
			fullname: file.name || file[ 1 ],
			size: file[ 2 ]
		};

	gs.files.push( that );
	source.srcObj = srcObj;
	source.that = that;
	source.setName( that.fullname );
	ui.dom.filesList.appendChild( source.elRoot );
	return source;
};

var gsfileDragging,
	elItemDragging;

function Source() {
	this.elRoot = ui.createHTML( Handlebars.templates.itemBuffer() )[ 0 ];
	this.elName = this.elRoot.querySelector( ".name" );
	this.elIcon = this.elRoot.querySelector( ".icon" );
	this.elWave = this.elRoot.querySelector( ".gsuiWaveform" );
	this.elRoot.onmousedown = this.mousedown.bind( this );
	this.elRoot.onclick = this.click.bind( this );
	this.elRoot.ondragstart = this.dragstart.bind( this );
	this.elRoot.oncontextmenu = function() { return false; };
};

Source.prototype = {
	setName: function( filename ) {
		this.elName.textContent = filename.replace( /\.[^.]+$/, "" );
	},
	error: function() {
		this.elIcon.classList.add( "cross" );
		this.elIcon.classList.remove( "loading" );
	},
	used: function() {
		this.elRoot.classList.add( "used" );
	},
	unused: function() {
		this.elRoot.classList.remove( "used" );
	},
	mousedown: function( e ) {
		if ( e.button !== 0 ) {
			waFwk.do.stopAllSources();
		}
		if ( e.ctrlKey ) {
			gs.file.delete( this );
		}
	},
	click: function( e ) {
		waFwk.do.stopAllSources();
		if ( this.that.isLoaded ) {
			waFwk.do.playSource( this.srcObj );
		} else if ( !this.srcObj.data ) {
			ui.gsuiPopup.open( "confirm", "Sample's data missing",
				"<code>" + this.srcObj.metadata.name + "</code> is missing...<br/>" +
				"Do you want to browse your files to find it ?" )
			.then( function( b ) {
				b && ui.filesInput.getFile(
					waFwk.do.fillSource.bind( this.srcObj ) );
			} );
		} else if ( !this.that.isLoading ) {
			waFwk.do.loadSource( this.srcObj )
				.then( waFwk.do.playSource );
		}
	},
	dragstart: function( e ) {
		if ( this.that.isLoaded && !gsfileDragging ) {
			gsfileDragging = this.that;
			elItemDragging = this.elRoot.cloneNode( true );
			elItemDragging.style.left = e.pageX + "px";
			elItemDragging.style.top = e.pageY + "px";
			elItemDragging.classList.add( "dragging" );
			ui.dom.app.appendChild( elItemDragging );
			ui.cursor( "app", "grabbing" );
		}
		return false;
	}
};

document.body.addEventListener( "mousemove", function( e ) {
	if ( gsfileDragging ) {
		elItemDragging.style.left = e.pageX + "px";
		elItemDragging.style.top = e.pageY + "px";
	}
} );

document.body.addEventListener( "mouseup", function( e ) {
	if ( gsfileDragging ) {
		elItemDragging.remove();
		gsfileDragging = null;
		ui.cursor( "app", null );
	}
} );

ui.dom.gridColB.addEventListener( "mouseup", function( e ) {
	if ( gsfileDragging ) {
		gs.history.pushExec( "create", {
			sample: gs.sample.create( gsfileDragging ),
			track: ui.getTrackFromPageY( e.pageY ),
			when: ui.getGridSec( e.pageX )
		} );
	}
} );

} )();
