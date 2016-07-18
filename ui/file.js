"use strict";

ui.CSS_fileUnloaded = function( f ) {
	f.elIcon.classList.add( "fa-download" );
	f.elIcon.classList.remove( "fa-question" );
	f.elFile.classList.add( "unloaded" );
};

ui.CSS_fileWithoutData = function( f ) {
	f.elIcon.classList.add( "fa-question" );
	f.elIcon.classList.remove( "fa-download" );
	f.elFile.classList.add( "unloaded" );
};

ui.CSS_fileLoading = function( f ) {
	f.elIcon.classList.add( "fa-refresh" );
	f.elIcon.classList.add( "fa-spin" );
	f.elIcon.classList.remove( "fa-download" );
};

ui.CSS_fileLoaded = function( f ) {
	f.elFile.classList.add( "loaded" );
	f.elFile.classList.remove( "unloaded" );
	f.elIcon.remove();
};

ui.CSS_fileError = function( f ) {
	f.elIcon.classList.add( "fa-times" );
	f.elIcon.classList.remove( "fa-refresh" );
	f.elIcon.classList.remove( "fa-spin" );
};

ui.CSS_fileUsed = function( f ) {
	f.elFile.classList.add( "used" );
};

ui.CSS_fileUnused = function( f ) {
	f.elFile.classList.remove( "used" );
};
