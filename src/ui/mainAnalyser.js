"use strict";

const UImainAnalyser = new gsuiSpectrum();

function UImainAnalyserInit() {
	UImainAnalyser.setCanvas( DOM.analyserCanvas );
	UImainAnalyser.setResolution( DAW.env.analyserFFTsize / 2 );
}
