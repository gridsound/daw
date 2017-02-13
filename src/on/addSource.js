"use strict";

waFwk.on.addSource = function( srcobj ) {
	var usrDat = new itemBuffer();

	usrDat.srcobj = srcobj;
	usrDat.elName.textContent = srcobj.metadata.name;
	ui.dom.filesList.appendChild( usrDat.elRoot );
	return usrDat;
};
