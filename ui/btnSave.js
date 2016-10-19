"use strict";

ui.initElement( "btnSave", function( el ) {
	return {
		click: function() {
			var attr = gs.save();

			el.setAttribute( "href", attr.href );
			el.setAttribute( "download", attr.download );
		}
	};
} );
