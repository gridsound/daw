"use strict";

ui.downloadBlob = function( name, blob ) {
	var a = document.createElement( "a" ),
		url = URL.createObjectURL( blob );

	a.download = name;
	a.href = url;
	a.click();
	URL.revokeObjectURL( url );
};
