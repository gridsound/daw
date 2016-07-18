"use strict";

ui.Track.prototype.initEditName = function() {
	var that = this;

	this.elName = wisdom.cE( "<span class='name text-overflow'>" )[ 0 ];
	this.elName.ondblclick = this.editName.bind( this, true );
	this.elColNamesTrack.appendChild( this.elName );

	this.elNameInput = wisdom.cE( "<input type='text'/>" )[ 0 ];
	this.elColNamesTrack.appendChild( this.elNameInput );
	this.elNameInput.onblur = function() {
		that.editName( this.value ).editName( false );
	};
	this.elNameInput.onkeydown = function( e ) {
		// 27->Echap, 13->Enter
		if ( e.keyCode === 13 || e.keyCode === 27 ) {
			that.editName( e.keyCode === 13 ? this.value : that.name )
				.editName( false );
		}
		// Don't interfere with any other keyboard shortcuts.
		e.stopPropagation();
	};
	return this;
};

ui.Track.prototype.editName = function( name ) {
	var input = this.elNameInput,
		trackId = "Track " + ( this.id + 1 );

	if ( typeof name === "string" ) {
		name = name
			.replace( /^\s+|\s+$/, "" )
			.replace( /\s+/g, " " );
		name = name === trackId ? "" : name;
		this.elName.classList.toggle( "empty", name === "" );
		this.elName.textContent = name || trackId;
		this.name = name;

	// Else name is a boolean.
	} else if ( name ) {
		this.elColNamesTrack.classList.add( "editing" );
		input.value = this.name || trackId;
		input.focus();
		input.select();
	} else {
		input.blur();
		this.elColNamesTrack.classList.remove( "editing" );
	}
	return this;
};
