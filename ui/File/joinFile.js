"use strict";

ui.File.prototype.joinFile = function( file ) {
	this.file = file;
	this.savedSize =
	this.savedType = undefined;
	this.jqToLoad.removeClass( "fa-question" )
		.addClass( "fa-download" );
	if ( this.fullname !== file.name ) {
		this.fullname = file.name;
		this.name = this.fullname.replace( /\.[^.]+$/, "" );
		this.jqName.text( this.name )	// Awww FIX ME PLZ :'(
			.prepend( this.jqToLoad );
	}
}
