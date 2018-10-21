"use strict";

function UItitle() {
	const name = DAW.get.name() || "GridSound";

	document.title = DAW.compositionNeedSave()
		? "*" + name
		: name;
}
