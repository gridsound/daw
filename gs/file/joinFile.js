"use strict";

gs.file.joinFile = function( that, file ) {
	that.source.unloaded();
	if ( that.fullname !== file.name ) {
		that.fullname = file.name;
		that.name = that.fullname.replace( /\.[^.]+$/, "" );
		that.elName.textContent = that.name;
	}
	that.isLoading = true;
	that.source.loading();
	that.source.srcObj.data = file;
	waFwk.do.loadSource( that.source.srcObj );
};
