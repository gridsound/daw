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

// tracks:
waFwk.on.addTrackBefore = function( trk, trkAfter ) { return new ui.track( trk, trkAfter ); };

// samples:
waFwk.on.sampleWhen = function( smpobj ) { smpobj.userData.when( smpobj.when ); };
waFwk.on.sampleInTrack = function( smpobj ) { smpobj.userData.inTrack( smpobj.trkobj ); };
waFwk.on.sampleDuration = function( smpobj ) { smpobj.userData.duration( smpobj.duration ); };
waFwk.on.removeSample = function( smpobj ) { smpobj.userData.elRoot.remove(); };
