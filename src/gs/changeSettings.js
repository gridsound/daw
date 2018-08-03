"use strict";

gs.changeSettings = function( obj ) {
	if ( "clockSteps" in obj ) {
		env.clockSteps = obj.clockSteps;
		ui.controls.updateClock();
	}
};
