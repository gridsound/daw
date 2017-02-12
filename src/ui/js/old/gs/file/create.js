"use strict";

gs.file.create = function( file ) {
	waFwk.do.addSource( {
		data: file.length ? null : file,
		metadata: {
			_file: file,
			duration: file.length ? file[ 3 ] : undefined
		}
	} );
};
