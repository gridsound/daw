"use strict";

ui.CSS_fileToLoad = function( f ) {
	f.jqToLoad.addClass( "fa-download" ).removeClass( "fa-question" );
	f.jqFile.addClass( "to-load" );
};

ui.CSS_fileWithoutData = function( f ) {
	f.jqToLoad.addClass( "fa-question" );
};

ui.CSS_fileLoading = function( f ) {
	f.jqToLoad.addClass( "fa-refresh fa-spin" ).removeClass( "fa-download" );
};

ui.CSS_fileReady = function( f ) {
	f.jqToLoad.remove();
	f.jqFile.removeClass( "to-load" );
};

ui.CSS_fileError = function( f ) {
	f.jqToLoad.addClass( "fa-times" ).removeClass( "fa-refresh fa-spin" );
};
