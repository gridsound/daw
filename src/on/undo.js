"use strict";

waFwk.on.undo = function( actobj ) {
	actobj.userData.elRoot.classList.add( "undone" );
};
