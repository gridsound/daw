"use strict";

ui.CSS_fileUnloaded = function( f ) {
	f.jqIcon.addClass( "fa-download" ).removeClass( "fa-question" );
	f.jqFile.addClass( "unloaded" );
};

ui.CSS_fileWithoutData = function( f ) {
	f.jqIcon.addClass( "fa-question" ).removeClass( "fa-download" );
	f.jqFile.addClass( "unloaded" );
};

ui.CSS_fileLoading = function( f ) {
	f.jqIcon.addClass( "fa-refresh fa-spin" ).removeClass( "fa-download" );
};

ui.CSS_fileLoaded = function( f ) {
	f.jqFile.addClass( "loaded" ).removeClass( "unloaded" );
	f.jqIcon.remove();
};

ui.CSS_fileError = function( f ) {
	f.jqIcon.addClass( "fa-times" ).removeClass( "fa-refresh fa-spin" );
};

ui.CSS_fileUsed = function( f ) {
	f.jqFile.addClass( "used" );
};

ui.CSS_fileUnused = function( f ) {
	f.jqFile.removeClass( "used" );
};
