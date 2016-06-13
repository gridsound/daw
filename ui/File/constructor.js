"use strict";

( function() {

var clickedFile;

ui.jqInputFile.change( function() {
	if ( clickedFile )
	{
		clickedFile.file = this.files[ 0 ];
		clickedFile.fullname = this.files[ 0 ].name;
		clickedFile.name = this.files[ 0 ].name.replace( /\.[^.]+$/, "" );
		clickedFile.jqName.text( clickedFile.name );
		clickedFile = undefined;
	}
});


ui.File = function( file ) {
	var that = this;

	this.id = ui.files.length; // change it when files could be removed
	this.file = file.length ? undefined : file;
	this.fullname = file.name || file[ 1 ];
	this.name = this.fullname.replace( /\.[^.]+$/, "" );
	this.isLoaded =
	this.isLoading = false;
	this.jqFile = $( "<a class='sample to-load' draggable='true'>" );
	this.jqName = $( "<span class='text-overflow'>" )
		.appendTo( this.jqFile )
		.text( this.name );
	this.jqToLoad = $( "<i class='to-load fa fa-fw fa-download'>" ).prependTo( this.jqName );
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
				alert( "Select the corresponding file or drag and drop the file " + that.name );
				clickedFile = that;
				ui.jqInputFile.click();
			} else if ( !that.isLoading ) {
				that.loaded();
			}
		}
	});
};

})();
