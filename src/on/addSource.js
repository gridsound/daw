"use strict";

( function() {

waFwk.on.addSource = function( srcObj ) {
	var usrDat = new SourceHTML();

	usrDat.srcObj = srcObj;
	usrDat.setName( srcObj.metadata.name );
	ui.dom.filesList.appendChild( usrDat.elRoot );
	return usrDat;
};

var srcDragging, srcCloned;

function SourceHTML() {
	this.elRoot = ui.createHTML( Handlebars.templates.itemBuffer() )[ 0 ];
	this.elName = this.elRoot.querySelector( ".name" );
	this.elIcon = this.elRoot.querySelector( ".icon" );
	this.elWave = this.elRoot.querySelector( ".gsuiWaveform" );

	this.elRoot.onmousedown = this.mousedown.bind( this );
	this.elRoot.onclick = this.click.bind( this );
	this.elRoot.ondragstart = this.dragstart.bind( this );
	this.elRoot.oncontextmenu = function() { return false; };

	this.isLoading =
	this.isLoaded = false;
};

SourceHTML.prototype = {
	setName: function( name ) {
		this.elName.textContent = name;
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
		if ( this.isLoaded ) {
			waFwk.do.playSource( this.srcObj );
		} else if ( !this.srcObj.data ) {
			ui.gsuiPopup.open( "confirm", "Sample's data missing",
				"<code>" + this.srcObj.metadata.name + "</code> is missing...<br/>" +
				"Do you want to browse your files to find it ?" )
			.then( function( b ) {
				b && ui.filesInput.getFile(
					waFwk.do.fillSource.bind( this.srcObj ) );
			} );
		} else if ( !this.isLoading ) {
			waFwk.do.loadSource( this.srcObj )
				.then( waFwk.do.playSource );
		}
	},
	dragstart: function( e ) {
		if ( this.isLoaded && !srcDragging ) {
			var elCursor;

			srcDragging = this.srcObj;
			srcCloned = this.elRoot.cloneNode( true );
			srcCloned.style.left = e.pageX + "px";
			srcCloned.style.top = e.pageY + "px";
			srcCloned.classList.add( "dragging" );
			elCursor = srcCloned.querySelector( "#filesCursor" );
			elCursor && elCursor.remove();
			ui.dom.app.appendChild( srcCloned );
			ui.cursor( "app", "grabbing" );
		}
		return false;
	}
};

document.body.addEventListener( "mousemove", function( e ) {
	if ( srcDragging ) {
		srcCloned.style.left = e.pageX + "px";
		srcCloned.style.top = e.pageY + "px";
	}
} );

document.body.addEventListener( "mouseup", function( e ) {
	if ( srcDragging ) {
		srcCloned.remove();
		srcCloned =
		srcDragging = null;
		ui.cursor( "app", null );
	}
} );

ui.dom.gridColB.addEventListener( "mouseup", function( e ) {
	if ( srcDragging ) {
		gs.history.pushExec( "create", {
			sample: gs.sample.create( srcDragging ),
			track: ui.getTrackFromPageY( e.pageY ),
			when: ui.getGridSec( e.pageX )
		} );
	}
} );

} )();
