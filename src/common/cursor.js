"use strict";

common.cursor = function( el, cur ) {
	if ( el !== "app" ) {
		common.cursor._set( ui.dom.gridcontent, common.cursor._saved = cur );
	} else {
		common.cursor._set( ui.dom.app, cur );
		common.cursor._set( ui.dom.gridcontent, cur ? null : common.cursor._saved );
	}
};

common.cursor._saved = null;
common.cursor._set = function( el, cur ) {
	if ( cur ) {
		el.dataset.cursor = cur;
	} else {
		el.removeAttribute( "data-cursor" );
	}
};
