"use strict";

waFwk.on.fillSource = function( srcObj ) {
	var usrDat = srcObj.userData,
		name = srcObj.data.name;

	if ( name ) {
		srcObj.metadata.name = name;
		usrDat.setName( name );
	}
	usrDat.elIcon.classList.remove( "question" );
	usrDat.elIcon.classList.add( "ramload" );
	usrDat.elRoot.classList.add( "unloaded" );
};
