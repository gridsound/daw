"use strict";

gs.file.load = function( that, fn ) {
	var source = that.source;

	that.isLoading = true;
	source.loading();
	that.wbuff.setFile( that.file )
		.then( function( wbuff ) {
			that.isLoaded = true;
			that.isLoading = false;
			source.loaded();
			fn( that );
		} );
};
