"use strict";

// undo/redo:
waFwk.on.pushAction = ui.history.pushAction;
waFwk.on.popAction = ui.history.popAction;
waFwk.on.undo = function( actobj ) { actobj.userData.done( false ); };
waFwk.on.redo = function( actobj ) { actobj.userData.done( true ); };

// controls:
waFwk.on.play = ui.controls.play;
waFwk.on.pause = ui.controls.pause;
waFwk.on.stop = ui.controls.stop;
