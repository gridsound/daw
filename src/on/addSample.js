"use strict";

waFwk.on.addSample = function( smpobj ) {
	var usrdat = new gridblockSample( smpobj );

	usrdat.name( smpobj.srcobj.metadata.name );
	return usrdat;
};
