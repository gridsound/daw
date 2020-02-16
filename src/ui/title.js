"use strict";

function UItitle( cmpName ) {
	const name = cmpName || "GridSound";

	document.title = DAW.compositionNeedSave() ? `*${ name }` : name;
}
