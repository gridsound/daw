"use strict";

ui.dom.btnPlay.onclick = gs.playPause;
ui.dom.btnStop.onclick = gs.stop;
wa.composition.onended( gs.compositionStop );
