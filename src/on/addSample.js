"use strict";

waFwk.on.addSample = function( smpobj ) {
	var usrdat = new ui.gridblockSample( smpobj );

	usrdat.name( smpobj.srcobj.metadata.name );
	return usrdat;
};
