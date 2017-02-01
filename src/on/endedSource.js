"use strict";

waFwk.on.endedSource = function( srcObj ) {
	if ( !waFwk.numberOfSourcesPlaying ) {
		ui.dom.filesCursor.remove();
	}
};
