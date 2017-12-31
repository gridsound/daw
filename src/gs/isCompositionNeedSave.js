"use strict";

gs.isCompositionNeedSave = function() {
	return !gs.currCmpSaved && ( gs.currCmp.savedAt || gs.undoredo._stack.length );
};
