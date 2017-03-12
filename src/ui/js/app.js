"use strict";

ui.mousedownPageX =
ui.mousedownPageY =
ui.mousemovePageX =
ui.mousemovePageY =
ui.mousemoveRelY =
ui.mousemoveRelY = 0;

ui.mouseleftIsDown =
ui.mouserightIsDown = false;

document.body.addEventListener( "mousedown", function( e ) {
	ui.mouseleftIsDown = e.button === 0;
	ui.mouserightIsDown = e.button === 2;
	ui.mousedownPageX = ui.mousemovePageX = e.pageX;
	ui.mousedownPageY = ui.mousemovePageY = e.pageY;
	ui.mousedownSec = ui.mousemoveSec = ui.grid.getWhen( e.pageX );
	ui.mousedownBind && ui.mousedownBind( e );
} );

document.body.addEventListener( "mousemove", function( e ) {
	if ( ui.mouseleftIsDown || ui.mouserightIsDown ) {
		var sec = ui.grid.getWhen( e.pageX );

		ui.mousemoveRelX = e.pageX - ui.mousemovePageX;
		ui.mousemoveRelY = e.pageY - ui.mousemovePageY;
		ui.mousemovePageX = e.pageX;
		ui.mousemovePageY = e.pageY;
		ui.mousemoveSecRel = sec - ui.mousemoveSec;
		ui.mousemoveSec = sec;
		ui.mousemoveBind && ui.mousemoveBind( e );
	}
} );

document.body.addEventListener( "mouseup", function( e ) {
	if ( ui.mouseleftIsDown || ui.mouserightIsDown ) {
		ui.mouseupBind && ui.mouseupBind( e );
		ui.mouseleftIsDown =
		ui.mouserightIsDown = false;
		ui.mousedownBind =
		ui.mousemoveBind =
		ui.mouseupBind = null;
	}
} );
