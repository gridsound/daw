"use strict";

ui.file = {
	unloaded: function( that ) {
		that.elIcon.classList.add( "ramload" );
		that.elIcon.classList.remove( "question" );
		that.elFile.classList.add( "unloaded" );
	},
	loading: function( that ) {
		that.elIcon.classList.add( "loading" );
		that.elIcon.classList.remove( "ramload" );
	},
	loaded: function( that ) {
		that.elFile.classList.add( "loaded" );
		that.elFile.classList.remove( "unloaded" );
		that.elIcon.remove();
	},
	withoutData: function( that ) {
		that.elIcon.classList.add( "question" );
		that.elIcon.classList.remove( "ramload" );
		that.elFile.classList.add( "unloaded" );
	},
	error: function( that ) {
		that.elIcon.classList.add( "cross" );
		that.elIcon.classList.remove( "loading" );
	},
	used: function( that ) {
		that.elFile.classList.add( "used" );
	},
	unused: function( that ) {
		that.elFile.classList.remove( "used" );
	}
};
