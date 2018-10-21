"use strict";

function UImasterAnalyserInit() {
	const spc = new gsuiSpectrum();

	spc.setResolution( 512 );
	DOM.analyser.append( spc.rootElement );
	window.UImasterAnalyser = spc;
}
