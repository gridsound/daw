"use strict";

const UImainAnalyser = new gsuiSpectrum();

function UImainAnalyserInit() {
	UImainAnalyser.setCanvas( DOM.headAnalyser );
	UImainAnalyser.setResolution( DAW.env.analyserFFTsize / 2 );
}
