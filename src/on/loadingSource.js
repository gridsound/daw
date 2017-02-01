"use strict";

waFwk.on.loadingSource = function( srcObj ) {
	srcObj.userData.that.isLoading = true;
	srcObj.userData.elIcon.classList.add( "loading" );
	srcObj.userData.elIcon.classList.remove( "ramload" );
};
