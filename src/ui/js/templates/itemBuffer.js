"use strict";

( function() {

var srcobjDragging,
	srchtmlCloned;

ui.itemBuffer = function( srcobj ) {
	var tpl = document.querySelector( "#itemBuffer" ).content,
		elRoot = document.importNode( tpl, true );

	ui.dom.templateCloned.appendChild( elRoot );
	elRoot = ui.dom.templateCloned.querySelector( ".item.buffer" );
	elRoot.remove();
	this.elRoot = elRoot;
	this.elName = elRoot.querySelector( ".name" );
	this.elIcon = elRoot.querySelector( ".icon" );
	this.elWave = elRoot.querySelector( ".gsuiWaveform" );

	this.isLoading =
	this.isLoaded = false;
	this.srcobj = srcobj;
	elRoot.onmousedown = this.mousedown.bind( this );
	elRoot.onclick = this.click.bind( this );
	elRoot.ondragstart = this.dragstart.bind( this );
	elRoot.oncontextmenu = function() { return false; };

	this.elName.textContent = srcobj.name;
	ui.dom.filesList.appendChild( elRoot );
};

ui.itemBuffer.prototype = {
	filled: function() {
		this.elName.textContent = this.srcobj.name;
		this.elIcon.classList.remove( "question" );
		this.elIcon.classList.add( "ramload" );
		this.elRoot.classList.add( "unloaded" );
	},
	loading: function() {
		this.isLoading = true;
		this.elIcon.classList.add( "loading" );
		this.elIcon.classList.remove( "ramload" );
	},
	loaded: function() {
		var buf = this.srcobj.buffer,
			bufDur = buf.duration,
			bufData0 = buf.getChannelData( 0 ),
			bufData1 = buf.numberOfChannels < 2 ? bufData0 : buf.getChannelData( 1 );

		this.isLoaded = true;
		this.isLoading = false;
		this.uiWaveform = new gsuiWaveform( this.elWave );
		this.uiWaveform.setResolution( 250, 40 );
		this.uiWaveform.draw( bufData0, bufData1, bufDur, 0, bufDur );
		this.elRoot.classList.add( "loaded" );
		this.elRoot.classList.remove( "unloaded" );
		this.elIcon.style.display = "none";
	},
	unloaded: function() {
		this.isLoaded =
		this.isLoading = false;
		this.uiWaveform.clear();
		delete this.uiWaveform;
		this.elIcon.classList.remove( "loading" );
		this.elIcon.classList.remove( "question" );
		this.elIcon.classList.remove( "cross" );
		this.elIcon.classList.add( "ramload" );
		this.elIcon.style.display = "inline-block";
		this.elRoot.classList.add( "unloaded" );
	},
	play: function() {
		var elCursor = ui.dom.filesCursor,
			dur = this.srcobj.duration;

		elCursor.style.transitionDuration =
		elCursor.style.left = 0;
		this.elRoot.appendChild( elCursor );
		setTimeout( function() {
			elCursor.style.transitionDuration = dur + "s";
			elCursor.style.left = "100%";
		}, 20 );
	},
	stop: function() {
		ui.dom.filesCursor.remove();
	},
	remove: function() {
		this.elRoot.remove();
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
			waFwk.stopAllSources();
		}
		if ( e.ctrlKey ) {
			waFwk.do( "removeSources", [ this.srcobj ] );
		}
	},
	click: function( e ) {
		waFwk.stopAllSources();
		if ( this.isLoaded ) {
			waFwk.playSource( this.srcobj );
		} else if ( !this.srcobj.data ) {
			ui.gsuiPopup.open( "confirm", "Sample's data missing",
				"<code>" + this.srcobj.name + "</code> is missing...<br/>" +
				"Do you want to browse your files to find it ?" )
			.then( function( b ) {
				if ( b ) {
					ui.filesInput.getFile(
						waFwk.do.bind( waFwk, "fillSource", this.srcobj ) );
				}
			} );
		} else if ( !this.isLoading ) {
			waFwk.do( "loadSources", [ this.srcobj ] )
				.then( waFwk.playSource.bind( waFwk, this.srcobj ) );
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
			common.cursor( "app", "grabbing" );
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
		common.cursor( "app", null );
	}
} );

ui.dom.gridColB.addEventListener( "mouseup", function( e ) {
	if ( srcobjDragging ) {
		waFwk.do( "addSamples", [ {
			source: srcobjDragging,
			track: ui.grid.getTrackByPageY( e.pageY ),
			when: ui.grid.getBeat( e.pageX )
		} ] );
	}
} );

} )();
