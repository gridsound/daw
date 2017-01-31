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
		};

	source.srcObj = srcObj;
	source.that = that;
	source.setName( that.fullname.replace( /\.[^.]+$/, "" ) );
	ui.dom.filesList.appendChild( source.elRoot );
	that.wbuff.sample.onended( gs.file.stop );
	gs.files.push( that );
	if ( srcObj.data ) {
		source.unloaded();
	} else {
		that.size = file[ 2 ];
		source.withoutData();
	}
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
	setName: function( name ) {
		this.elName.textContent =
		this.name = name;
		this.that.name = name;
	},
	unloaded: function() {
		this.elIcon.classList.add( "ramload" );
		this.elIcon.classList.remove( "question" );
		this.elRoot.classList.add( "unloaded" );
	},
	loading: function() {
		this.elIcon.classList.add( "loading" );
		this.elIcon.classList.remove( "ramload" );
	},
	withoutData: function() {
		this.elIcon.classList.add( "question" );
		this.elIcon.classList.remove( "ramload" );
		this.elRoot.classList.add( "unloaded" );
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
			gs.file.stop();
		}
		if ( e.ctrlKey ) {
			gs.file.delete( this );
		}
	},
	click: function( e ) {
		var that = this.that;

		if ( that.isLoaded ) {
			waFwk.do.playSource( this.srcObj );
		} else if ( !that.file ) {
			ui.gsuiPopup.open( "confirm", "Sample's data missing",
				"<code>" + this.name + "</code> is missing...<br/>" +
				"Do you want to browse your files to find it ?" )
			.then( function( b ) {
				if ( b ) {
					ui.filesInput.getFile( function( file ) {
						gs.file.joinFile( that, file );
					} );
				}
			} );
		} else if ( !that.isLoading ) {
			that.isLoading = true;
			that.source.loading();
			waFwk.do.loadSource( this.srcObj )
				.then( waFwk.do.playSource );
		}
	},
	dragstart: function( e ) {
		var that = this.that;

		if ( that.isLoaded && !gsfileDragging ) {
			gsfileDragging = that;
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
