"use strict";

ui.CSS_fileToLoad = function( f ) {
	f.jqToLoad.addClass( "fa-download" );
	f.jqFile.addClass( "to-load" );
};

ui.CSS_fileWithoutData = function( f ) {
	f.jqToLoad.addClass( "fa-question" );
};

ui.CSS_fileLoading = function( f ) {
	f.jqToLoad.removeClass( "fa-download" )
		.addClass( "fa-refresh fa-spin" );
};

ui.CSS_fileReady = function( f ) {
	f.jqToLoad.remove();
	f.jqFile.removeClass( "to-load" );
};

ui.CSS_fileError = function( f ) {
	f.jqToLoad.removeClass( "fa-refresh fa-spin" )
		.addClass( "fa-times" );
};
