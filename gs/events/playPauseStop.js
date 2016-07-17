"use strict";

ui.elPlay.onclick = function() {
	gs.fileStop();
	gs.playToggle();
};

ui.elStop.onclick = function() {
	gs.fileStop();
	gs.stop();
};

wa.composition.onended( gs.stop );
