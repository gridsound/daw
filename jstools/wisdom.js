"use strict";

( function() {

var wd = window.wisdom = {};

wd.cE =
wd.createElement = function( nodename ) {
	if ( nodename[ 0 ] !== "<" ) {
		return document.createElement( nodename );
	}
	var div = document.createElement( "div" );
	div.innerHTML = nodename;
	return div.children;
};

} )();
