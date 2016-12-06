"use strict";

ui.Track.prototype.initEditName = function() {
	var that = this;

	this.name = "";
	this.elName = this.elColNamesTrack.querySelector( ".gs-ui-span-editable" );
	gsUIComponents( this.elName, {
		onchange: function( val ) {
			that.name = val;
		}
	} );
	this.elName._setPlaceholder( "Track " + ( this.id + 1 ) );
	return this;
};

ui.Track.prototype.editName = function( name ) {
	this.elName._setValue( name );
	return this;
};
