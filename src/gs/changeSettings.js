"use strict";

gs.changeSettings = function( obj ) {
	env.clockSteps = obj.clockSteps;
	ui.controls.clock( gs.controls.currentTime() );
};
