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

// sources:
waFwk.on.addSource = function( srcobj ) { return new ui.itemBuffer( srcobj ); };
waFwk.on.removeSource = function( srcobj ) { srcobj.userData.remove(); };
waFwk.on.fillSource = function( srcobj ) { srcobj.userData.filled(); };
waFwk.on.loadSource = function( srcobj ) { srcobj.userData.loaded(); };
waFwk.on.loadingSource = function( srcobj ) { srcobj.userData.loading(); };
waFwk.on.unloadSource = function( srcobj ) { srcobj.userData.unloaded(); };

// tracks:
waFwk.on.addTrackBefore = function( trk, trkAfter ) { return new ui.track( trk, trkAfter ); };

// samples:
waFwk.on.removeSample = function( smpobj ) { smpobj.userData.remove(); };
waFwk.on.selectSample = function( smpobj ) { smpobj.userData.select( true ); };
waFwk.on.unselectSample = function( smpobj ) { smpobj.userData.select( false ); };
waFwk.on.sampleWhen = function( smpobj ) { smpobj.userData.when( smpobj.when ); };
waFwk.on.moveSampleToTrack = function( smpobj, trkobj ) { smpobj.userData.inTrack( trkobj ); };
waFwk.on.sampleDuration = function( smpobj ) { smpobj.userData.duration( smpobj.duration ); };
