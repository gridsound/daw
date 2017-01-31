"use strict";

waFwk.on.removeTrack = function( trkObject ) {
	lg( "removeTrack", trkObject );
};

waFwk.on.addSource = function( srcObj ) {
	lg( "addSource", srcObj );
};

waFwk.on.addSources = function( srcArr ) {
	lg( "addSources", srcArr );
};

waFwk.on.loadSources = function( srcArr ) {
	lg( "loadSources", srcArr );
};

waFwk.on.addComposition = function( cmpObject ) {
	lg( "addComposition", cmpObject );
};

waFwk.on.removeComposition = function( cmpObject ) {
	lg( "removeComposition", cmpObject );
};

waFwk.on.loadComposition = function( cmpObject ) {
	lg( "loadComposition", cmpObject );
};

waFwk.on.unload = function( cmpObject ) {
	lg( "unload", cmpObject );
};

waFwk.on.save = function( cmpObject ) {
	lg( "save", cmpObject );
};

waFwk.on.render = function( wavBlob ) {
	lg( "render", wavBlob );
};

waFwk.on.pause = function( cmpObject ) {
	lg( "pause", cmpObject );
};
