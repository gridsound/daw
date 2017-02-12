"use strict";

( function() {

var that,
	tA = -1,
	tB = -1,
	whenSave,
	durationSave;

gs.loop = that = {
	reorderTimeAB: function() {
		if ( tA >= 0 && tB >= 0 ) {
			tA = gs.composition.loopWhen;
			tB = tA + gs.composition.loopDuration;
		}
	},
	timeA: function( sec ) {
		lg("timea")
		tA = sec;
		that.update();
	},
	timeB: function( sec ) {
		lg("timeb")
		tB = sec;
		that.update();
	},
	stop: function() {
		tA = tB = -1;
		gs.composition.loop( false );
		ui.timelineLoop.toggle( false );
	},
	update: function() {
		if ( tA >= 0 && tB >= 0 ) {
			var isLooping,
				when = Math.min( tA, tB ),
				duration = Math.abs( tB - tA );

			if ( when !== whenSave || duration !== durationSave ) {
				whenSave = when;
				durationSave = duration;
				// isLooping = gs.composition.isLooping;
				isLooping = duration > 0.01;
				if ( isLooping ) {
					gs.composition.loop( when, duration );
					ui.timelineLoop.when( when );
					ui.timelineLoop.duration( duration );
				}
				ui.timelineLoop.toggle( isLooping );
			}
		}
	}
};

} )();
