"use strict";

waFwk.on.sampleCreate = function( smpobj ) {
	var usrdat = new gridBlockSample( smpobj );

	usrdat.name( smpobj.srcobj.metadata.name );
	return usrdat;
};
