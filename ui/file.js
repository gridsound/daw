"use strict";

ui.CSS_fileUnloaded = function( f ) {
	f.elIcon.classList.add( "ramload" );
	f.elIcon.classList.remove( "question" );
	f.elFile.classList.add( "unloaded" );
};

ui.CSS_fileWithoutData = function( f ) {
	f.elIcon.classList.add( "question" );
	f.elIcon.classList.remove( "ramload" );
	f.elFile.classList.add( "unloaded" );
};

ui.CSS_fileLoading = function( f ) {
	f.elIcon.classList.add( "loading" );
	f.elIcon.classList.remove( "ramload" );
};

ui.CSS_fileLoaded = function( f ) {
	f.elFile.classList.add( "loaded" );
	f.elFile.classList.remove( "unloaded" );
	f.elIcon.remove();
};

ui.CSS_fileError = function( f ) {
	f.elIcon.classList.add( "cross" );
	f.elIcon.classList.remove( "loading" );
};

ui.CSS_fileUsed = function( f ) {
	f.elFile.classList.add( "used" );
};

ui.CSS_fileUnused = function( f ) {
	f.elFile.classList.remove( "used" );
};
