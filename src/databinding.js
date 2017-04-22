"use strict";

// undo/redo:
waFwk.on.pushAction = ui.history.pushAction;
waFwk.on.popAction = ui.history.popAction;
waFwk.on.undo = function( actobj ) { actobj.userData.done( false ); };
waFwk.on.redo = function( actobj ) { actobj.userData.done( true ); };

// controls:
waFwk.on.play = ui.controls.play;
waFwk.on.pause =
waFwk.on.stop = ui.controls.stop;
waFwk.on.bpm = ui.bpm.set;
waFwk.on.currentTime = ui.timeline.currentTime;

// sources:
waFwk.on.addSource = function( srcobj ) { return new ui.itemBuffer( srcobj ); };
waFwk.on.removeSource = function( srcobj ) { srcobj.userData.remove(); };
waFwk.on.fillSource = function( srcobj ) { srcobj.userData.filled(); };
waFwk.on.loadSource = function( srcobj ) { srcobj.userData.loaded(); };
waFwk.on.loadingSource = function( srcobj ) { srcobj.userData.loading(); };
waFwk.on.unloadSource = function( srcobj ) { srcobj.userData.unloaded(); };
waFwk.on.endedSource =
waFwk.on.stopSource = function( srcobj ) { srcobj.userData.stop(); };
waFwk.on.playSource = function( srcobj ) { srcobj.userData.play(); };

// tracks:
waFwk.on.addTrackBefore = function( trk, trkAfter ) { return new ui.track( trk, trkAfter ); };
waFwk.on.nameTrack = function( trk, name ) { trk.userData.name( name ); };

// samples:
waFwk.on.addSample = function( smp ) { return new ui.gridblockSample( smp ); };
waFwk.on.removeSample = function( smp ) { smp.userData.remove(); };
waFwk.on.selectSample = function( smp ) { smp.userData.select( true ); };
waFwk.on.unselectSample = function( smp ) { smp.userData.select( false ); };
waFwk.on.sampleWhen = function( smp, when ) { smp.userData.when( when ); };
waFwk.on.sampleDuration = function( smp, dur ) { smp.userData.duration( dur ); };
waFwk.on.sampleToTrack = function( smp, trk ) { smp.userData.toTrack( trk ); };
waFwk.on.sampleWaveform = function( smp, buf, off, dur ) { smp.userData.waveform( buf, off, dur ); };
