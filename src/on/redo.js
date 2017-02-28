"use strict";

waFwk.on.redo = function( actobj ) {
	actobj.userData.elRoot.classList.remove( "undone" );
};
