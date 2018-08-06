"use strict";

class uiRenderPopup {
	constructor() {
		const root = dom.renderPopupContent;

		root.remove();
		this._btn = root.querySelector( "#render-btn" );
		this._progressbar = root.querySelector( "#render-progress" );
		this._btn.onclick = this._onclickBtn.bind( this );
	}

	show() {
		this._progressbar.value = 0;
		this._btn.dataset.status = "0";
		this._btn.href = "";
		gsuiPopup.custom( {
			ok: "Close",
			title: "Render",
			element: dom.renderPopupContent,
		} ).then( () => {
			if ( wa.render.isOn ) {
				wa.mainGrid.scheduler.stop();
			}
		} );
		return false;
	}

	// private:
	_onclickBtn() {
		const a = this._btn,
			d = a.dataset;

		if ( d.status === "2" ) {
			return;
		} else if ( d.status === "0" ) {
			const cmp = gs.currCmp,
				dur = cmp.duration * 60 / cmp.bpm;

			d.status = "1";
			this._intervalId = setInterval( () => {
				this._progressbar.value =
					( wa.ctx.currentTime - wa.renderStartTime ) / dur;
			}, 40 );
			gs.exportCurrentCompositionToWAV().then( url => {
				clearInterval( this._intervalId );
				this._progressbar.value = 1;
				a.href = url;
				d.status = "2";
				a.download = ( cmp.name || "untitled" ) + ".wav";
			} );
		}
		return false;
	}
}

	// 	const id = this._cmpId,
	// 		cmpLoaded = id === currCmp.id,
// 		    cmp = cmpLoaded ? currCmp : gs.localStorage.get( id ),
// 			name = cmp.name || "untitled";

// 			if ( !this._wavReady ) {
// 				this._wavReady = 1;
// 				a.download = name + ".wav";
// 				gs.exportCurrentCompositionToWAV().then( url => {
// 					this._wavReady = 2;
// 					a.href = url;
// 				} );
// 			}
