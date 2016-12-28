"use strict";

ui.Track.prototype.initEditName = function() {
	var that = this;

	this.name = "";
	this.gsuiSpanEditable = new gsuiSpanEditable(
		this.elColNamesTrack.querySelector( ".gsuiSpanEditable" ), {
		onchange: function( val ) {
			that.name = val;
		}
	} );
	this.gsuiSpanEditable.setPlaceholder( "Track " + ( this.id + 1 ) );
	return this;
};

ui.Track.prototype.editName = function( name ) {
	this.gsuiSpanEditable.setValue( name );
	return this;
};
