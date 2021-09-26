"use strict";

function UIdomInit() {
	document.body.append(
		GSUI.getTemplate( "app" ),
		GSUI.getTemplate( "window-main" ),
		GSUI.getTemplate( "window-piano" ),
		GSUI.getTemplate( "window-drums" ),
		GSUI.getTemplate( "window-synth" ),
		GSUI.getTemplate( "window-mixer" ),
		GSUI.getTemplate( "window-blocks" ),
		GSUI.getTemplate( "window-effects" ),
		GSUI.getTemplate( "popup-auth" ),
		GSUI.getTemplate( "popup-open" ),
		GSUI.getTemplate( "popup-about" ),
		GSUI.getTemplate( "popup-tempo" ),
		GSUI.getTemplate( "popup-render" ),
		GSUI.getTemplate( "popup-settings" ),
		GSUI.getTemplate( "popup-shortcuts" ),
		GSUI.getTemplate( "popup-selectChan" ),
	);
	window.DOM = UIdomFill();
	DOM.authPopupContent.remove();
	DOM.openPopupContent.remove();
	DOM.aboutPopupContent.remove();
	DOM.tempoPopupContent.remove();
	DOM.renderPopupContent.remove();
	DOM.settingsPopupContent.remove();
	DOM.shortcutsPopupContent.remove();
	DOM.selectChanPopupContent.remove();
}

function UIdomFill() {
	const DOM = UIdomFillIds(),
		winBtns = DOM.winBtns.querySelectorAll( ".winBtn" );

	DOM.winBtnsMap = Array.prototype.reduce.call( winBtns, ( map, btn ) => {
		map.set( btn.dataset.win, btn );
		return map;
	}, new Map() );
	return DOM;
}

function UIdomFillIds() {
	const ids = document.querySelectorAll( "[id]" );

	return Array.prototype.reduce.call( ids, ( obj, el ) => {
		obj[ el.id ] = el;
		if ( "remove" in el.dataset ) {
			el.remove();
			el.removeAttribute( "data-remove" );
		}
		return obj;
	}, {} );
}
