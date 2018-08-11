"use strict";

gs.isCompositionNeedSave = () => (
	!gs.currCmpSaved && ( gs.currCmp.savedAt || gs.undoredo._stack.length )
);
