"use strict";

function UIsettingsPopupInit() {
	DOM.headSettings.onclick = UIsettingsPopupShow;
	DOM.settingsUIRateManual.oninput = UIsettingsPopupUIRateOninput;
	DAW.setLoopRate( UIsettingsGetUIRate() );
	UIwindows.lowGraphics( UIsettingsGetLowGraphicsValue() );
	gsuiClock.numbering( UIsettingsGetTimelineNumbering() );
	gsuiTimeline.numbering( UIsettingsGetTimelineNumbering() );
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

function UIsettingsGetTimelineNumbering() {
	return localStorage.getItem( "uiTimeNumbering" ) || "1";
}

function UIsettingsPopupShow() {
	const uiRefreshRate = UIsettingsGetUIRate();

	( uiRefreshRate >= 60
		? DOM.settingsUIRateModeAuto
		: DOM.settingsUIRateModeManual ).checked = true;
	DOM.settingsPopupSampleRate.value = DAW.env.sampleRate;
	DOM.settingsUIRateManual.value = uiRefreshRate;
	DOM.settingsWindowsMode.checked = !UIsettingsGetLowGraphicsValue();
	DOM.settingsTimelineNumbering.value = UIsettingsGetTimelineNumbering();
	UIsettingsPopupUIRateOninput();
	gsuiPopup.custom( {
		title: "Settings",
		submit: UIsettingsPopupSubmit,
		element: DOM.settingsPopupContent,
	} ).then();
}

function UIsettingsPopupSubmit( form ) {
	const uiRate = form.UIRateMode === "auto" ? 60 : form.UIRateManual,
		lowGraphics = !form.windowsDirectMode,
		timelineNumbering = form.timelineNumbering;

	DAW.setSampleRate( +form.sampleRate );
	DAW.setLoopRate( uiRate );
	UIwindows.lowGraphics( lowGraphics );
	gsuiClock.numbering( timelineNumbering );
	gsuiTimeline.numbering( timelineNumbering );
	localStorage.setItem( "uiRefreshRate", uiRate );
	localStorage.setItem( "gsuiWindows.lowGraphics", +lowGraphics );
	localStorage.setItem( "uiTimeNumbering", timelineNumbering );
}
