"use strict";

window.onhashchange = function() {
	ui.toggleAbout( location.hash === "#about" );
};
