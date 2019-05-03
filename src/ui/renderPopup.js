"use strict";

function UIrenderPopupInit() {
	DOM.headExport.onclick = UIrenderPopupShow;
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
	} ).then( () => DAW.abortWAVExport() );
	return false;
}

function UIrenderPopupRender() {
	const a = DOM.renderBtn,
		d = a.dataset;

	if ( d.status === "2" ) {
		return;
	} else if ( d.status === "0" ) {
		const dur = DAW.get.duration() * 60 / DAW.get.bpm();

		d.status = "1";
		UIrenderPopupRender._intervalId = setInterval( () => {
			DOM.renderProgress.value = DAW.ctx.currentTime / dur;
		}, 100 );
		DAW.exportCompositionToWAV().then( obj => {
			clearInterval( UIrenderPopupRender._intervalId );
			DOM.renderProgress.value = 1;
			d.status = "2";
			a.href = obj.url;
			a.download = obj.name;
		} );
	}
	return false;
}
