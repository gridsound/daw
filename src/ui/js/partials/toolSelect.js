"use strict";

ui.tool.select = {
	init: function() {
		ui.dom.squareSelection.remove();
	},
	mousedown: function( e ) {
		var smpobj = e.target.smpobj;

		if ( !e.shiftKey ) {
			waFwk.do( "unselectAllSamples" );
		}
		if ( smpobj ) {
			ui.tool.select._smpMousedown = smpobj;
			smpobj.userData.select(
				ui.tool.select._smpMousedownIsSelected =
					e.shiftKey ? !smpobj.selected : true );
		}
	},
	mouseup: function( e ) {
		var that = ui.tool.select;

		lg("ui.tool.select.mouseup 1")
		if ( that._smpMousedown ) {
			lg("ui.tool.select.mouseup 2")
			waFwk.do( that._smpMousedownIsSelected
				? "selectSamples" : "unselectSamples",
				[ that._smpMousedown ] );
			that._smpMousedown = null;
		} else if ( that._smpSelected.length > 0 ) {
			// ...
			ui.dom.squareSelection.remove();
		}
	},
	mousemove: function( e ) {
	},

	// private:
	_smpSelected: []
};
