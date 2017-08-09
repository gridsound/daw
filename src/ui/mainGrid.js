"use strict";

ui.mainGrid = {
	init() {
		var elDrop = ui.idElements.mainGridWrap.querySelector( ".gsui-grid .gsui-content" );

		elDrop.ondrop = ui.mainGrid._ondrop;
		elDrop.ondragenter = function( e ) {
			e.dataTransfer.dropEffect = "copy";
		};
	},
	empty() {
	},
	change( data ) {
	},

	// events:
	_ondrop( e ) {
		var patId = e.dataTransfer.getData( "text" );

		console.log( "Drop in #mainGrid", patId );
		e.stopPropagation();
		return false;
	}
};
