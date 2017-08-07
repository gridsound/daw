"use strict";

gs.changeSettings = function( obj ) {
	settings.clockSteps = obj.clockSteps;
	ui.controls.clock( gs.currentTime() );
};
