"use strict";

gs.controls = {
	init() {
		gs.controls.status = "stopped";
		gs.controls.times = {
			main: 0,
			pattern: 0
		};
		gs.controls.patternLoopA =
		gs.controls.patternLoopB = false;
		gs.controls._grid = "main";
		gs.controls._loopOn();
	},
	currentTime( grid, beat ) {
		if ( beat == null ) {
			return gs.controls.times[ grid ];
		}
		gs.controls.times[ grid ] = beat;
		ui.controls.currentTime( grid, beat );
		wa.controls.setCurrentTime( beat );
	},
	patternLoop( isLoop, loopA, loopB ) {
		gs.controls.patternLoopA = isLoop ? loopA : null;
		gs.controls.patternLoopB = isLoop ? loopB : null;
		ui.controls.loop( "pattern", isLoop, loopA, loopB );
		wa.controls.setLoop( isLoop ? loopA : false, loopB );
	},
	play() {
		if ( gs.controls.status !== "playing" ) {
			gs.controls.status = "playing";
			wa.controls.start( gs.controls.times[ gs.controls._grid ] );
			ui.controls.play();
		}
	},
	pause() {
		if ( gs.controls.status === "playing" ) {
			gs.controls.status = "paused";
			gs.controls.times[ gs.controls._grid ] = wa.controls.getCurrentTime();
			wa.controls.stop();
			ui.controls.pause();
		}
	},
	stop() {
		if ( gs.controls.status === "stopped" ) {
			gs.controls.currentTime( gs.controls._grid, 0 );
		} else {
			gs.controls.status = "stopped";
			wa.controls.stop();
			ui.controls.stop();
			gs.controls.currentTime( gs.controls._grid,
				( gs.controls._grid === "main"
					? gs.currCmp.loopA
					: gs.controls.patternLoopA ) || 0 );
			switch ( document.activeElement ) {
				case ui.mainGrid.patternroll.rootElement: gs.controls.focusOn( "main" ); break;
				case ui.pattern.pianoroll.rootElement: gs.controls.focusOn( "pattern" ); break;
			}
		}
	},
	focusOn( grid ) {
		if ( grid !== gs.controls._grid && (
			grid === "main" ||
			gs.currCmp.patternOpened )
		) {
			if ( gs.controls.status === "playing" ) {
				gs.controls.times[ gs.controls._grid ] = wa.controls.getCurrentTime();
			}
			gs.controls._grid = grid;
			ui.controls.focusOn( grid );
			ui.controls.clock( gs.controls.currentTime( grid ) );
			wa.controls.focusOn( grid );
		}
	},
	askFocusOn( grid ) {
		if ( gs.controls.status !== "playing" && gs.controls._grid !== grid ) {
			gs.controls.focusOn( grid );
		}
	},

	// private:
	_loopOn() {
		gs.controls._loop();
	},
	_loopOff() {
		cancelAnimationFrame( gs.controls._frameId );
	},
	_loop() {
		wa.destination.analyser.getByteFrequencyData( wa.destination.analyserData );
		ui.controls.spectrum.draw( wa.destination.analyserData );
		if ( gs.controls.status === "playing" ) {
			ui.controls.currentTime( gs.controls._grid, wa.controls.getCurrentTime() );
		}
		gs.controls._frameId = requestAnimationFrame( gs.controls._loop );
	}
};
