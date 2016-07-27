"use strict";

( function() {

ui.showHistory = function() {
	ui.elBtnFiles.classList.remove( "selected" );
	ui.elBtnHistory.classList.add( "selected" );
};

ui.showFiles = function() {
	ui.elBtnHistory.classList.remove( "selected" );
	ui.elBtnFiles.classList.add( "selected" );
};

} )();
