"use strict";

gs.changeSettings = obj => {
	if ( "clockSteps" in obj ) {
		env.clockSteps = obj.clockSteps;
		ui.controls.updateClock();
	}
};
