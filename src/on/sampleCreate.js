"use strict";

waFwk.on.sampleCreate = function( smpobj ) {
	var usrdat = new gridblockSample( smpobj );

	usrdat.name( smpobj.srcobj.metadata.name );
	return usrdat;
};
