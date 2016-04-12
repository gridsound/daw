"use strict";

(function() {

var wsample;

ui.playFile = function( uifile ) {
	if ( wsample ) {
		wsample.stop();
	}
	wsample = uifile.wbuff.createSample().load().start();
};

ui.stopFile = function() {
	wsample.stop();
};

})();
