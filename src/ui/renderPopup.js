"use strict";

function UIrenderPopupInit() {
	DOM.renderBtn.onclick = UIrenderPopupRender;
}

function UIrenderPopupShow() {
	DOM.renderProgress.value = 0;
	DOM.renderBtn.dataset.status = "0";
	DOM.renderBtn.href = "";
	gsuiPopup.custom( {
		ok: "Close",
		title: "Render",
		element: DOM.renderPopupContent,
	} ).then( () => {
		if ( wa.render.isOn ) {
			wa.mainGrid.scheduler.stop();
		}
	} );
	return false;
}

function UIrenderPopupRender() {
	const a = DOM.renderBtn,
		d = a.dataset;

	if ( d.status === "2" ) {
		return;
	} else if ( d.status === "0" ) {
		const cmp = DAW.get.composition(),
			dur = cmp.duration * 60 / cmp.bpm;

		d.status = "1";
		this._intervalId = setInterval( () => {
			DOM.renderProgress.value =
				( wa.ctx.currentTime - wa.renderStartTime ) / dur;
		}, 40 );
		gs.exportCurrentCompositionToWAV().then( url => {
			clearInterval( this._intervalId );
			DOM.renderProgress.value = 1;
			a.href = url;
			d.status = "2";
			a.download = ( cmp.name || "untitled" ) + ".wav";
		} );
	}
	return false;
}
