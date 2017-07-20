"use strict";

gs.changeSettings = function( obj ) {
	settings.clockSteps = obj.clockSteps;
	ui.controls.clock( 0 ); // 0 --> gs.currentTime()
};
