"use strict";

ui.jqBtnTools.tool = {};

ui.jqBtnTools
	.each( function() {
		ui.jqBtnTools.tool[ this.dataset.tool ] = this;
	})
	.click( function() {
		ui.selectTool( this.dataset.tool );
	});
;
