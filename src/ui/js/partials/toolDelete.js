"use strict";

ui.tool.delete = {
	mouseup: function() {
		var smparr = ui.tool.delete._smpDeleted;

		if ( smparr.length > 0 ) {
			waFwk.do( "removeSamples", smparr.slice() );
			smparr.length = 0;
		}
	},

	// private:
	_smpDeleted: [],
	_del: function( e ) {
		var smpobj = e.target.smpobj;

		if ( smpobj ) {
			ui.tool.delete._smpDeleted.push( smpobj );
			smpobj.userData.hide();
		}
	}
};

ui.tool.delete.mousedown =
ui.tool.delete.mousemove = ui.tool.delete._del;
