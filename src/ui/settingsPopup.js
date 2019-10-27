"use strict";

function UIsettingsPopupInit() {
	DOM.headSettings.onclick = UIsettingsPopupShow;
	DOM.settingsUIRateManual.oninput = UIsettingsPopupUIRateOninput;
	DAW.setLoopRate( UIsettingsGetUIRate() );
	UIwindows.lowGraphics( UIsettingsGetLowGraphicsValue() );
}

function UIsettingsPopupUIRateOninput( e ) {
	DOM.settingsUIRateManualFps.textContent = DOM.settingsUIRateManual.value.padStart( 2, "0" );
	if ( e ) {
		DOM.settingsUIRateModeManual.checked = true;
	}
}

function UIsettingsGetLowGraphicsValue() {
	return !!+( localStorage.getItem( "gsuiWindows.lowGraphics" ) || "0" );
}

function UIsettingsGetUIRate() {
	return +localStorage.getItem( "uiRefreshRate" ) || 60;
}

function UIsettingsPopupShow() {
	const uiRefreshRate = UIsettingsGetUIRate();

	( uiRefreshRate >= 60
		? DOM.settingsUIRateModeAuto
		: DOM.settingsUIRateModeManual ).checked = true;
	DOM.settingsUIRateManual.value = uiRefreshRate;
	DOM.settingsWindowsMode.checked = !UIsettingsGetLowGraphicsValue();
	UIsettingsPopupUIRateOninput();
	gsuiPopup.custom( {
		title: "Settings",
		submit: UIsettingsPopupSubmit,
		element: DOM.settingsPopupContent,
	} ).then();
}

function UIsettingsPopupSubmit( form ) {
	const rate = form.UIRateMode === "auto" ? 60 : form.UIRateManual,
		lowGraphics = !form.windowsDirectMode;

	DAW.setLoopRate( rate );
	UIwindows.lowGraphics( lowGraphics );
	localStorage.setItem( "uiRefreshRate", rate );
	localStorage.setItem( "gsuiWindows.lowGraphics", +lowGraphics );
}
