"use strict";

waFwk.on.removeSample = function( smpobj ) {
	smpobj.userData.elRoot.remove();
	smpobj.userData = null;
};
