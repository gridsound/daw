"use strict";

waFwk.on.fillSource = function( srcobj ) {
	var dom = srcobj.userData;

	dom.elName.textContent = srcobj.metadata.name;
	dom.elIcon.classList.remove( "question" );
	dom.elIcon.classList.add( "ramload" );
	dom.elRoot.classList.add( "unloaded" );
};
