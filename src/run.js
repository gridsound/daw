"use strict";

ui.init();
wa.init();
gs.init();
gs.loadNewComposition().then( function() {
	gs.controls.togglePlay( env.togglePlay );
} );
