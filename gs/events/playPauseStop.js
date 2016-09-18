"use strict";

ui.elPlay.onclick = gs.playPause;
ui.elStop.onclick = gs.stop;
wa.composition.onended( gs.compositionStop );
