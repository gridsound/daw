"use strict";

( function() {

var clickedFile;

ui.jqInputFile.change( function() {
	if ( clickedFile )
	{
		clickedFile.joinFile( this.files[ 0 ] );
		clickedFile = undefined;
	}
});


ui.File = function( file ) {
	var that = this,
		icone = file.length ? "question" : "download";

	this.id = ui.files.length; // FIX ME when uifiles could be removed
	this.file = file.length ? undefined : file;
	this.fullname = file.name || file[ 1 ];
	this.name = this.fullname.replace( /\.[^.]+$/, "" );
	this.isLoaded =
	this.isLoading = false;
	if ( !this.file ) {
		this.savedSize = file[ 2 ];
	}
	this.jqFile = $( "<a class='sample to-load' draggable='true'>" );
	this.jqToLoad = $( "<i class='to-load fa fa-fw fa-" + icone + "'>" );
	this.jqName = $( "<span>" + this.name + "</span>" );
	$( "<span class='name text-overflow'>" )
		.append( this.jqToLoad )
		.append( this.jqName )
		.appendTo( this.jqFile )
	this.jqFile.on( {
		contextmenu: false,
		dragstart: this.dragstart.bind( this ),
		mousedown: function( e ) {
			if ( e.button !== 0 ) {
				ui.stopFile();
			}
		},
		click: function() {
			if ( that.isLoaded ) {
				ui.playFile( that );
			} else if ( !that.file ) {
				alert( "Choose the file to associate or drag and drop " + that.name );
				clickedFile = that;
				ui.jqInputFile.click();
			} else if ( !that.isLoading ) {
				that.load( ui.playFile );
			}
		}
	});
};

})();
