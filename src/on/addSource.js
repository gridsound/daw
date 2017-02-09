"use strict";

( function() {

waFwk.on.addSource = function( srcobj ) {
	var usrDat = new SourceHTML();

	usrDat.srcobj = srcobj;
	usrDat.elName.textContent = srcobj.metadata.name;
	ui.dom.filesList.appendChild( usrDat.elRoot );
	return usrDat;
};

var srcobjDragging,
	srchtmlCloned;

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
			waFwk.do.playSource( this.srcobj );
		} else if ( !this.srcobj.data ) {
			ui.gsuiPopup.open( "confirm", "Sample's data missing",
				"<code>" + this.srcobj.metadata.name + "</code> is missing...<br/>" +
				"Do you want to browse your files to find it ?" )
			.then( function( b ) {
				b && ui.filesInput.getFile(
					waFwk.do.fillSource.bind( this.srcobj ) );
			} );
		} else if ( !this.isLoading ) {
			waFwk.do.loadSource( this.srcobj )
				.then( waFwk.do.playSource );
		}
	},
	dragstart: function( e ) {
		if ( this.isLoaded && !srcobjDragging ) {
			var elCursor;

			srcobjDragging = this.srcobj;
			srchtmlCloned = this.elRoot.cloneNode( true );
			srchtmlCloned.style.left = e.pageX + "px";
			srchtmlCloned.style.top = e.pageY + "px";
			srchtmlCloned.classList.add( "dragging" );
			elCursor = srchtmlCloned.querySelector( "#filesCursor" );
			elCursor && elCursor.remove();
			ui.dom.app.appendChild( srchtmlCloned );
			ui.cursor( "app", "grabbing" );
		}
		return false;
	}
};

document.body.addEventListener( "mousemove", function( e ) {
	if ( srcobjDragging ) {
		srchtmlCloned.style.left = e.pageX + "px";
		srchtmlCloned.style.top = e.pageY + "px";
	}
} );

document.body.addEventListener( "mouseup", function( e ) {
	if ( srcobjDragging ) {
		srchtmlCloned.remove();
		srchtmlCloned =
		srcobjDragging = null;
		ui.cursor( "app", null );
	}
} );

ui.dom.gridColB.addEventListener( "mouseup", function( e ) {
	if ( srcobjDragging ) {
		waFwk.do.sampleCreate( {
			srcobj: srcobjDragging,
			trkobj: ui.getTrackFromPageY( e.pageY ),
			when: ui.getGridSec( e.pageX )
		} );
	}
} );

} )();
