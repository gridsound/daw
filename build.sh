#!/bin/bash

writeHeader() {
	echo '<!DOCTYPE html>'
	echo '<html lang="en">'
	echo '<head>'
	echo '<title>GridSound</title>'
	echo '<meta charset="utf-8"/>'
	echo '<meta name="viewport" content="width=device-width, user-scalable=no"/>'
	echo '<meta name="description" content="A free and Open-Source DAW (digital audio workstation)"/>'
	echo '<meta name="google" content="notranslate"/>'
	echo '<meta name="theme-color" content="#3a5158"/>'
	echo '<meta property="og:type" content="website"/>'
	echo '<meta property="og:title" content="GridSound"/>'
	echo '<meta property="og:url" content="https://gridsound.com/daw/"/>'
	echo '<meta property="og:image" content="https://gridsound.com/assets/og-image.jpg"/>'
	echo '<meta property="og:image:width" content="800"/>'
	echo '<meta property="og:image:height" content="400"/>'
	echo '<meta property="og:description" content="a free and open source DAW (digital audio workstation)"/>'
	echo '<link rel="manifest" href="manifest.json"/>'
	echo '<link rel="shortcut icon" href="assets/favicon.png"/>'
}
writeBody() {
	echo '</head>'
	echo '<body>'
	echo '<noscript>GridSound needs JavaScript to run</noscript>'
}
writeEnd() {
	echo '</body>'
	echo '</html>'
}
writeCSS() {
	printf '<link rel="stylesheet" href="%s"/>\n' "${CSSfiles[@]}"
}
writeJS() {
	printf '<script src="%s"></script>\n' "${JSfiles[@]}"
}
writeCSScompress() {
	echo -n '' > allCSS.css
	cat "${CSSfiles[@]}" >> allCSS.css
	echo '<style>'
	csso allCSS.css
	echo '</style>'
	rm allCSS.css
}
writeJScompress() {
	echo '"use strict";' > allJS.js
	cat "${JSfilesProd[@]}" >> allJS.js
	cat "${JSfiles[@]}" >> allJS.js
	echo '<script>'
	terser allJS.js --compress --mangle --toplevel --mangle-props "regex='^[$]'"
	echo '</script>'
	rm allJS.js
}

declare -a CSSfiles=(
	"assets/fonts/fonts.css"
	"src/reset.css"
	"src/splashScreen.css"

	"gs-ui-components/gsui.css"
	"gs-ui-components/gsuiGlitchText/gsuiGlitchText.css"
	"gs-ui-components/gsuiHelpLink/gsuiHelpLink.css"
	"gs-ui-components/gsuiIcon/gsuiIcon.css"
	"gs-ui-components/gsuiRipple/gsuiRipple.css"
	"gs-ui-components/gsuiDropdown/gsuiDropdown.css"
	"gs-ui-components/gsuiActionMenu/gsuiActionMenu.css"
	"gs-ui-components/gsuiComButton/gsuiComButton.css"
	"gs-ui-components/gsuiDAW/gsuiDAW.css"
	"gs-ui-components/gsuiDAW/gsuiDAW-btn.css"
	"gs-ui-components/gsuiDAW/gsuiDAW-head.css"
	"gs-ui-components/gsuiDAW/gsuiDAW-windows.css"
	"gs-ui-components/gsuiDAW/gsuiDAW-popup-about.css"
	"gs-ui-components/gsuiDAW/gsuiDAW-popup-export.css"
	"gs-ui-components/gsuiDAW/gsuiDAW-popup-settings.css"
	"gs-ui-components/gsuiTitleUser/gsuiTitleUser.css"
	"gs-ui-components/gsuiPanels/gsuiPanels.css"
	"gs-ui-components/gsuiTimeline/gsuiTimeline.css"
	"gs-ui-components/gsuiTimewindow/gsuiTimewindow.css"
	"gs-ui-components/gsuiAnalyserHist/gsuiAnalyserHist.css"
	"gs-ui-components/gsuiAnalyserVu/gsuiAnalyserVu.css"
	"gs-ui-components/gsuiEnvelopeGraph/gsuiEnvelopeGraph.css"
	"gs-ui-components/gsuiEnvelope/gsuiEnvelope.css"
	"gs-ui-components/gsuiLFO/gsuiLFO.css"
	"gs-ui-components/gsuiPropSelect/gsuiPropSelect.css"
	"gs-ui-components/gsuiDrumrow/gsuiDrumrow.css"
	"gs-ui-components/gsuiDrumrows/gsuiDrumrows.css"
	"gs-ui-components/gsuiDrum/gsuiDrum.css"
	"gs-ui-components/gsuiDrums/gsuiDrums.css"
	"gs-ui-components/gsuiClock/gsuiClock.css"
	"gs-ui-components/gsuiChannel/gsuiChannel.css"
	"gs-ui-components/gsuiChannels/gsuiChannels.css"
	"gs-ui-components/gsuiCurves/gsuiCurves.css"
	"gs-ui-components/gsuiEffect/gsuiEffect.css"
	"gs-ui-components/gsuiEffects/gsuiEffects.css"
	"gs-ui-components/gsuiFxDelay/gsuiFxDelay.css"
	"gs-ui-components/gsuiFxFilter/gsuiFxFilter.css"
	"gs-ui-components/gsuiFxReverb/gsuiFxReverb.css"
	"gs-ui-components/gsuiFxWaveShaper/gsuiFxWaveShaper.css"
	"gs-ui-components/gsuiMixer/gsuiMixer.css"
	"gs-ui-components/gsuiReorder/gsuiReorder.css"
	"gs-ui-components/gsuiDragline/gsuiDragline.css"
	"gs-ui-components/gsuiBeatlines/gsuiBeatlines.css"
	"gs-ui-components/gsuiBlocksManager/gsuiBlocksManager.css"
	"gs-ui-components/gsuiPatternroll/gsuiPatternroll.css"
	"gs-ui-components/gsuiPianoroll/gsuiPianoroll.css"
	"gs-ui-components/gsuiPianoroll/gsuiPianoroll-block.css"
	"gs-ui-components/gsuiKeys/gsuiKeys.css"
	"gs-ui-components/gsuiNoise/gsuiNoise.css"
	"gs-ui-components/gsuiOscillator/gsuiOscillator.css"
	"gs-ui-components/gsuiWaveEdit/gsuiWaveEdit.css"
	"gs-ui-components/gsuiPeriodicWave/gsuiPeriodicWave.css"
	"gs-ui-components/gsuiSynthesizer/gsuiSynthesizer.css"
	"gs-ui-components/gsuiDotline/gsuiDotline.css"
	"gs-ui-components/gsuiPopup/gsuiPopup.css"
	"gs-ui-components/gsuiScrollShadow/gsuiScrollShadow.css"
	"gs-ui-components/gsuiSlicer/gsuiSlicer.css"
	"gs-ui-components/gsuiSlider/gsuiSlider.css"
	"gs-ui-components/gsuiSliderGroup/gsuiSliderGroup.css"
	"gs-ui-components/gsuiLibraries/gsuiLibraries.css"
	"gs-ui-components/gsuiLibrary/gsuiLibrary.css"
	"gs-ui-components/gsuiPatterns/gsuiPatterns.css"
	"gs-ui-components/gsuiPatterns/gsuiPatterns-synth.css"
	"gs-ui-components/gsuiPatterns/gsuiPatterns-pattern.css"
	"gs-ui-components/gsuiTempo/gsuiTempo.css"
	"gs-ui-components/gsuiToggle/gsuiToggle.css"
	"gs-ui-components/gsuiTrack/gsuiTrack.css"
	"gs-ui-components/gsuiWindows/gsuiWindows.css"
	"gs-ui-components/gsuiWindows/gsuiWindow.css"
)

declare -a JSfilesProd=(
	"src/initServiceWorker.js"
)

declare -a JSfiles=(
	"src/checkBrowser.js"

	"gs-utils/gs-utils.js"
	"gs-utils/gs-utils-dom.js"
	"gs-utils/gs-utils-fft.js"
	"gs-utils/gs-utils-json.js"
	"gs-utils/gs-utils-audio.js"
	"gs-utils/gs-utils-files.js"
	"gs-utils/gs-utils-models.js"

	"gs-api-client/gsapiClient.js"

	"daw-core/src/DAWCore.js"
	"daw-core/src/DAWCoreBuffers.js"
	"daw-core/src/DAWCoreCompositionExportWAV.js"
	"daw-core/src/DAWCoreCompositionFormat.js"
	"daw-core/src/DAWCoreDestination.js"
	"daw-core/src/DAWCoreHistory.js"
	"daw-core/src/DAWCoreHistoryTexts.js"
	"daw-core/src/DAWCoreSlicesBuffers.js"
	"daw-core/src/DAWCoreComposition.js"
	"daw-core/src/DAWCoreSlices.js"
	"daw-core/src/DAWCoreDrums.js"
	"daw-core/src/DAWCoreKeys.js"

	"daw-core/src/controllers/blocks.js"
	"daw-core/src/controllers/drumrows.js"
	"daw-core/src/controllers/drums.js"
	"daw-core/src/controllers/effects.js"
	"daw-core/src/controllers/keys.js"
	"daw-core/src/controllers/mixer.js"
	"daw-core/src/controllers/synth.js"
	"daw-core/src/controllers/tracks.js"
	"daw-core/src/controllers/slicer.js"

	"daw-core/src/actions/common/addPatternBuffer.js"
	"daw-core/src/actions/common/calcNewDuration.js"
	"daw-core/src/actions/common/calcNewKeysDuration.js"
	"daw-core/src/actions/common/createUniqueName.js"
	"daw-core/src/actions/common/getDrumrowName.js"
	"daw-core/src/actions/common/getNextIdOf.js"
	"daw-core/src/actions/common/getNextOrderOf.js"
	"daw-core/src/actions/common/patternOpenedByType.js"
	"daw-core/src/actions/common/toggleSolo.js"
	"daw-core/src/actions/common/updatePatternDuration.js"

	"daw-core/src/actions/addBlock.js"
	"daw-core/src/actions/addChannel.js"
	"daw-core/src/actions/addDrumcuts.js"
	"daw-core/src/actions/addDrumrow.js"
	"daw-core/src/actions/addDrums.js"
	"daw-core/src/actions/addEffect.js"
	"daw-core/src/actions/addKey.js"
	"daw-core/src/actions/addOscillator.js"
	"daw-core/src/actions/addOscillatorSource.js"
	"daw-core/src/actions/addPatternBuffer.js"
	"daw-core/src/actions/addPatternDrums.js"
	"daw-core/src/actions/addPatternKeys.js"
	"daw-core/src/actions/addPatternSlices.js"
	"daw-core/src/actions/addSynth.js"
	"daw-core/src/actions/changeChannel.js"
	"daw-core/src/actions/changeDrumrow.js"
	"daw-core/src/actions/changeDrumrowPattern.js"
	"daw-core/src/actions/changeDrumsProps.js"
	"daw-core/src/actions/changeEffect.js"
	"daw-core/src/actions/changeEffectProp.js"
	"daw-core/src/actions/changeEnv.js"
	"daw-core/src/actions/changeKeysProps.js"
	"daw-core/src/actions/changeLFO.js"
	"daw-core/src/actions/changeLoop.js"
	"daw-core/src/actions/changeNoise.js"
	"daw-core/src/actions/changeOscillator.js"
	"daw-core/src/actions/changeOscillatorSource.js"
	"daw-core/src/actions/changePatternBufferInfo.js"
	"daw-core/src/actions/changePatternSlices.js"
	"daw-core/src/actions/changeTempo.js"
	"daw-core/src/actions/clonePattern.js"
	"daw-core/src/actions/cloneSelectedBlocks.js"
	"daw-core/src/actions/cloneSelectedKeys.js"
	"daw-core/src/actions/closePattern.js"
	"daw-core/src/actions/cropEndBlocks.js"
	"daw-core/src/actions/cropEndKeys.js"
	"daw-core/src/actions/cropStartBlocks.js"
	"daw-core/src/actions/dropMidiOnKeys.js"
	"daw-core/src/actions/editOscillatorWave.js"
	"daw-core/src/actions/moveBlocks.js"
	"daw-core/src/actions/moveKeys.js"
	"daw-core/src/actions/openChannel.js"
	"daw-core/src/actions/openPattern.js"
	"daw-core/src/actions/openSynth.js"
	"daw-core/src/actions/redirectChannel.js"
	"daw-core/src/actions/redirectKey.js"
	"daw-core/src/actions/redirectPatternBuffer.js"
	"daw-core/src/actions/redirectPatternKeys.js"
	"daw-core/src/actions/redirectPatternSlices.js"
	"daw-core/src/actions/redirectSynth.js"
	"daw-core/src/actions/removeBlocks.js"
	"daw-core/src/actions/removeChannel.js"
	"daw-core/src/actions/removeDrumcuts.js"
	"daw-core/src/actions/removeDrumrow.js"
	"daw-core/src/actions/removeDrums.js"
	"daw-core/src/actions/removeEffect.js"
	"daw-core/src/actions/removeKeys.js"
	"daw-core/src/actions/removeOscillator.js"
	"daw-core/src/actions/removePattern.js"
	"daw-core/src/actions/removeSynth.js"
	"daw-core/src/actions/renameChannel.js"
	"daw-core/src/actions/renameComposition.js"
	"daw-core/src/actions/renamePattern.js"
	"daw-core/src/actions/renameSynth.js"
	"daw-core/src/actions/renameTrack.js"
	"daw-core/src/actions/reorderChannel.js"
	"daw-core/src/actions/reorderDrumrow.js"
	"daw-core/src/actions/reorderOscillator.js"
	"daw-core/src/actions/reorderPattern.js"
	"daw-core/src/actions/selectBlocks.js"
	"daw-core/src/actions/selectKeys.js"
	"daw-core/src/actions/toggleChannel.js"
	"daw-core/src/actions/toggleDrumrow.js"
	"daw-core/src/actions/toggleEffect.js"
	"daw-core/src/actions/toggleEnv.js"
	"daw-core/src/actions/toggleLFO.js"
	"daw-core/src/actions/toggleNoise.js"
	"daw-core/src/actions/toggleSoloDrumrow.js"
	"daw-core/src/actions/toggleSoloTrack.js"
	"daw-core/src/actions/toggleTrack.js"
	"daw-core/src/actions/unselectAllBlocks.js"
	"daw-core/src/actions/unselectAllKeys.js"
	"daw-core/src/actions/unselectBlock.js"
	"daw-core/src/actions/unselectKey.js"

	"gs-components/gsDAW/gsDAW.js"
	"gs-components/gsDrums/gsDrums.js"
	"gs-components/gsMixer/gsMixer.js"
	"gs-components/gsPatternroll/gsPatternroll.js"
	"gs-components/gsLibraries/gsLibraries.js"
	"gs-components/gsPatterns/gsPatterns.js"
	"gs-components/gsPianoroll/gsPianoroll.js"
	"gs-components/gsSynth/gsSynth.js"
	"gs-components/gsSlicer/gsSlicer.js"

	"gs-wa-components/gswaNoise/gswaNoise.js"
	"gs-wa-components/gswaReverbIR/gswaReverbIR.js"
	"gs-wa-components/gswaOscillator/gswaOscillator.js"
	"gs-wa-components/gswaLFO/gswaLFO.js"
	"gs-wa-components/gswaEnvelope/gswaEnvelope.js"
	"gs-wa-components/gswaMixer/gswaMixer.js"
	"gs-wa-components/gswaSynth/gswaSynth.js"
	"gs-wa-components/gswaKeysScheduler/gswaKeysScheduler.js"
	"gs-wa-components/gswaDrumsScheduler/gswaDrumsScheduler.js"
	"gs-wa-components/gswaSlicer/gswaSlicer.js"
	"gs-wa-components/gswaBPMTap/gswaBPMTap.js"
	"gs-wa-components/gswaEffects/gswaEffects.js"
	"gs-wa-components/gswaFxDelay/gswaFxDelay.js"
	"gs-wa-components/gswaFxFilter/gswaFxFilter.js"
	"gs-wa-components/gswaFxReverb/gswaFxReverb.js"
	"gs-wa-components/gswaFxWaveShaper/gswaFxWaveShaper.js"
	"gs-wa-components/gswaDrumrows/gswaDrumrows.js"
	"gs-wa-components/gswaScheduler/gswaScheduler.js"
	"gs-wa-components/gswaEncodeWAV/gswaEncodeWAV.js"
	"gs-wa-components/gswaStereoPanner/gswaStereoPanner.js"
	"gs-wa-components/gswaPeriodicWaves/gswaPeriodicWaves.js"
	"gs-wa-components/gswaMIDIParser/gswaMIDIParser.js"
	"gs-wa-components/gswaMIDIParser/gswaMIDIToKeys.js"
	"gs-wa-components/gswaMIDIDevices/gswaMIDIDevices.js"
	"gs-wa-components/gswaMIDIDevices/gswaMIDIInput.js"
	"gs-wa-components/gswaMIDIDevices/gswaMIDIOutput.js"

	"gs-ui-components/gsuiDAW/gsuiDAW.html.js"
	"gs-ui-components/gsuiDAW/gsuiDAW-windows.html.js"
	"gs-ui-components/gsuiDAW/gsuiDAW-popup-about.html.js"
	"gs-ui-components/gsuiDAW/gsuiDAW-popup-export.html.js"
	"gs-ui-components/gsuiDAW/gsuiDAW-popup-settings.html.js"
	"gs-ui-components/gsuiGlitchText/gsuiGlitchText.html.js"
	"gs-ui-components/gsuiTitleUser/gsuiTitleUser.html.js"
	"gs-ui-components/gsuiAnalyserVu/gsuiAnalyserVu.html.js"
	"gs-ui-components/gsuiEnvelopeGraph/gsuiEnvelopeGraph.html.js"
	"gs-ui-components/gsuiEnvelope/gsuiEnvelope.html.js"
	"gs-ui-components/gsuiLFO/gsuiLFO.html.js"
	"gs-ui-components/gsuiClock/gsuiClock.html.js"
	"gs-ui-components/gsuiChannel/gsuiChannel.html.js"
	"gs-ui-components/gsuiChannels/gsuiChannels.html.js"
	"gs-ui-components/gsuiCurves/gsuiCurves.html.js"
	"gs-ui-components/gsuiEffect/gsuiEffect.html.js"
	"gs-ui-components/gsuiEffects/gsuiEffects.html.js"
	"gs-ui-components/gsuiFxDelay/gsuiFxDelay.html.js"
	"gs-ui-components/gsuiFxFilter/gsuiFxFilter.html.js"
	"gs-ui-components/gsuiFxReverb/gsuiFxReverb.html.js"
	"gs-ui-components/gsuiFxWaveShaper/gsuiFxWaveShaper.html.js"
	"gs-ui-components/gsuiMixer/gsuiMixer.html.js"
	"gs-ui-components/gsuiDragline/gsuiDragline.html.js"
	"gs-ui-components/gsuiBeatlines/gsuiBeatlines.html.js"
	"gs-ui-components/gsuiPatternroll/gsuiPatternroll.html.js"
	"gs-ui-components/gsuiPianoroll/gsuiPianoroll.html.js"
	"gs-ui-components/gsuiPropSelect/gsuiPropSelect.html.js"
	"gs-ui-components/gsuiDrumrow/gsuiDrumrow.html.js"
	"gs-ui-components/gsuiDrumrows/gsuiDrumrows.html.js"
	"gs-ui-components/gsuiDrum/gsuiDrum.html.js"
	"gs-ui-components/gsuiDrums/gsuiDrums.html.js"
	"gs-ui-components/gsuiKeys/gsuiKeys.html.js"
	"gs-ui-components/gsuiNoise/gsuiNoise.html.js"
	"gs-ui-components/gsuiOscillator/gsuiOscillator.html.js"
	"gs-ui-components/gsuiWaveEdit/gsuiWaveEdit.html.js"
	"gs-ui-components/gsuiSynthesizer/gsuiSynthesizer.html.js"
	"gs-ui-components/gsuiDotlineSVG/gsuiDotlineSVG.html.js"
	"gs-ui-components/gsuiDotline/gsuiDotline.html.js"
	"gs-ui-components/gsuiPopup/gsuiPopup.html.js"
	"gs-ui-components/gsuiSlicer/gsuiSlicer.html.js"
	"gs-ui-components/gsuiSlider/gsuiSlider.html.js"
	"gs-ui-components/gsuiSliderGroup/gsuiSliderGroup.html.js"
	"gs-ui-components/gsuiTimeline/gsuiTimeline.html.js"
	"gs-ui-components/gsuiTimewindow/gsuiTimewindow.html.js"
	"gs-ui-components/gsuiLibraries/gsuiLibraries.html.js"
	"gs-ui-components/gsuiLibrary/gsuiLibrary.html.js"
	"gs-ui-components/gsuiPatterns/gsuiPatterns-infoPopup.html.js"
	"gs-ui-components/gsuiPatterns/gsuiPatterns-pattern.html.js"
	"gs-ui-components/gsuiPatterns/gsuiPatterns-synth.html.js"
	"gs-ui-components/gsuiPatterns/gsuiPatterns.html.js"
	"gs-ui-components/gsuiTempo/gsuiTempo.html.js"
	"gs-ui-components/gsuiTrack/gsuiTrack.html.js"
	"gs-ui-components/gsuiWindows/gsuiWindow.html.js"

	"gs-ui-components/gsui0ne/gsui0ne.js"
	"gs-ui-components/gsuiGlitchText/gsuiGlitchText.js"
	"gs-ui-components/gsuiHelpLink/gsuiHelpLink.js"
	"gs-ui-components/gsuiDAW/gsuiDAW.js"
	"gs-ui-components/gsuiRipple/gsuiRipple.js"
	"gs-ui-components/gsuiDropdown/getAbsPos.js"
	"gs-ui-components/gsuiDropdown/gsuiDropdown.js"
	"gs-ui-components/gsuiActionMenu/gsuiActionMenu.js"
	"gs-ui-components/gsuiComButton/gsuiComButton.js"
	"gs-ui-components/gsuiTitleUser/gsuiTitleUser.js"
	"gs-ui-components/gsuiEnvelopeGraph/gsuiEnvelopeGraph.js"
	"gs-ui-components/gsuiEnvelope/gsuiEnvelope.js"
	"gs-ui-components/gsuiLFO/gsuiLFO.js"
	"gs-ui-components/gsuiClock/gsuiClock.js"
	"gs-ui-components/gsuiChannel/gsuiChannel.js"
	"gs-ui-components/gsuiChannels/gsuiChannels.js"
	"gs-ui-components/gsuiCurves/gsuiCurves.js"
	"gs-ui-components/gsuiEffect/gsuiEffect.js"
	"gs-ui-components/gsuiEffects/gsuiEffects.js"
	"gs-ui-components/gsuiFxDelay/gsuiFxDelay.js"
	"gs-ui-components/gsuiFxFilter/gsuiFxFilter.js"
	"gs-ui-components/gsuiFxReverb/gsuiFxReverb.js"
	"gs-ui-components/gsuiFxWaveShaper/gsuiFxWaveShaper.js"
	"gs-ui-components/gsuiMixer/gsuiMixer.js"
	"gs-ui-components/gsuiReorder/gsuiReorder.js"
	"gs-ui-components/gsuiReorder/gsuiReorder.listReorder.js"
	"gs-ui-components/gsuiReorder/gsuiReorder.listComputeOrderChange.js"
	"gs-ui-components/gsuiDragline/gsuiDragline.js"
	"gs-ui-components/gsuiBeatlines/gsuiBeatlines.js"
	"gs-ui-components/gsuiBlocksManager/gsuiBlocksManager.js"
	"gs-ui-components/gsuiPatternroll/gsuiPatternroll.js"
	"gs-ui-components/gsuiPianoroll/gsuiPianoroll.js"
	"gs-ui-components/gsuiPropSelect/gsuiPropSelect.js"
	"gs-ui-components/gsuiDrumrow/gsuiDrumrow.js"
	"gs-ui-components/gsuiDrumrows/gsuiDrumrows.js"
	"gs-ui-components/gsuiDrum/gsuiDrum.js"
	"gs-ui-components/gsuiDrum/gsuiDrumcut.js"
	"gs-ui-components/gsuiDrums/gsuiDrums.js"
	"gs-ui-components/gsuiKeys/gsuiKeys.js"
	"gs-ui-components/gsuiNoise/gsuiNoise.js"
	"gs-ui-components/gsuiOscillator/gsuiOscillator.js"
	"gs-ui-components/gsuiWaveEdit/gsuiWaveEdit.js"
	"gs-ui-components/gsuiPeriodicWave/gsuiPeriodicWave.js"
	"gs-ui-components/gsuiSynthesizer/gsuiSynthesizer.js"
	"gs-ui-components/gsuiDotlineSVG/gsuiDotlineSVG.js"
	"gs-ui-components/gsuiDotline/gsuiDotline.js"
	"gs-ui-components/gsuiPanels/gsuiPanels.js"
	"gs-ui-components/gsuiPopup/gsuiPopup.js"
	"gs-ui-components/gsuiScrollShadow/gsuiScrollShadow.js"
	"gs-ui-components/gsuiSlicer/gsuiSlicer.js"
	"gs-ui-components/gsuiSlider/gsuiSlider.js"
	"gs-ui-components/gsuiSliderGroup/gsuiSliderGroup.js"
	"gs-ui-components/gsuiTimeline/gsuiTimeline.js"
	"gs-ui-components/gsuiTimewindow/gsuiTimewindow.js"
	"gs-ui-components/gsuiLibraries/gsuiLibraries.js"
	"gs-ui-components/gsuiLibrary/gsuiLibrary.js"
	"gs-ui-components/gsuiPatterns/gsuiPatterns.js"
	"gs-ui-components/gsuiTempo/gsuiTempo.js"
	"gs-ui-components/gsuiToggle/gsuiToggle.js"
	"gs-ui-components/gsuiTrack/gsuiTrack.js"
	"gs-ui-components/gsuiTracklist/gsuiTracklist.js"
	"gs-ui-components/gsuiAnalyserHz/gsuiAnalyserHz.js"
	"gs-ui-components/gsuiAnalyserVu/gsuiAnalyserVu.js"
	"gs-ui-components/gsuiAnalyserHist/gsuiAnalyserHist.js"
	"gs-ui-components/gsuiWaveform/gsuiWaveform.js"
	"gs-ui-components/gsuiSVGPatterns/gsuiSVGPatterns.js"
	"gs-ui-components/gsuiSVGPatterns/gsuiSVGPatternsDrums.js"
	"gs-ui-components/gsuiSVGPatterns/gsuiSVGPatternsKeys.js"
	"gs-ui-components/gsuiSVGPatterns/gsuiSVGPatternsSlices.js"
	"gs-ui-components/gsuiWindows/gsuiWindows.js"
	"gs-ui-components/gsuiWindows/gsuiWindow.js"

	"src/run.js"
)

buildDev() {
	filename='index.html'
	echo "Build $filename"
	writeHeader > $filename
	writeCSS >> $filename
	writeBody >> $filename
	cat src/splashScreen.html >> $filename
	echo '<script>function lg( a ) { return console.log.apply( console, arguments ), a; }</script>' >> $filename
	writeJS >> $filename
	writeEnd >> $filename
}

buildProd() {
	filename='index-prod.html'
	echo "Build $filename"
	writeHeader > $filename
	writeCSScompress >> $filename
	writeBody >> $filename
	cat src/splashScreen.html >> $filename
	echo '<script>function lg(a){return a}</script>' >> $filename
	writeJScompress >> $filename
	writeEnd >> $filename
}

lint() {
	stylelint "${CSSfiles[@]}"
	echo '"use strict";' > __lintMain.js
	cat "${JSfilesProd[@]}" | grep -v '"use strict";' >> __lintMain.js
	cat "${JSfiles[@]}" | grep -v '"use strict";' >> __lintMain.js
	eslint __lintMain.js && rm __lintMain.js
}

updateDep() {
	git submodule init
	git submodule update --remote
}

count() {
	find ../daw/src/          -name '*.js' -not -name '*.html.js'  -exec wc -l {} \; | cut -d' ' -f1 | awk '{s+=$1} END {printf "* daw              %5.0f JS lines\n", s}'
	find ../daw/src/          -name '*.css'                        -exec wc -l {} \; | cut -d' ' -f1 | awk '{s+=$1} END {printf "                   %5.0f CSS lines\n", s}'
	find ../daw/src/          -name '*.html.js' -or -name '*.html' -exec wc -l {} \; | cut -d' ' -f1 | awk '{s+=$1} END {printf "                   %5.0f HTML lines\n\n", s}'
	find ../daw-core/         -name '*.js'                         -exec wc -l {} \; | cut -d' ' -f1 | awk '{s+=$1} END {printf "* daw-core         %5.0f JS lines\n\n", s}'
	find ../gs-utils/         -name '*.js'                         -exec wc -l {} \; | cut -d' ' -f1 | awk '{s+=$1} END {printf "* gs-utils         %5.0f JS lines\n\n", s}'
	find ../gs-components/    -name '*.js'                         -exec wc -l {} \; | cut -d' ' -f1 | awk '{s+=$1} END {printf "* gs-component     %5.0f JS lines\n\n", s}'
	find ../gs-wa-components/ -name '*.js'                         -exec wc -l {} \; | cut -d' ' -f1 | awk '{s+=$1} END {printf "* gs-wa-components %5.0f JS lines\n\n", s}'
	find ../gs-ui-components/ -name '*.js' -not -name '*.html.js'  -exec wc -l {} \; | cut -d' ' -f1 | awk '{s+=$1} END {printf "* gs-ui-components %5.0f JS lines\n", s}'
	find ../gs-ui-components/ -name '*.css'                        -exec wc -l {} \; | cut -d' ' -f1 | awk '{s+=$1} END {printf "                   %5.0f CSS lines\n", s}'
	find ../gs-ui-components/ -name '*.html.js'                    -exec wc -l {} \; | cut -d' ' -f1 | awk '{s+=$1} END {printf "                   %5.0f HTML lines\n", s}'
}

if [ $# = 0 ]; then
	echo '          --------------------------------'
	echo '        .:: GridSound build shell-script ::.'
	echo '        ------------------------------------'
	echo ''
	echo './build.sh dev ---> create "index.html" for development'
	echo './build.sh prod --> create "index-prod.html" for production'
	echo './build.sh lint --> launch the JS/CSS linters (ESLint and Stylelint)'
	echo './build.sh dep ---> update all the submodules'
elif [ $1 = "dep" ]; then
	updateDep
elif [ $1 = "dev" ]; then
	buildDev
elif [ $1 = "prod" ]; then
	buildProd
elif [ $1 = "lint" ]; then
	lint
elif [ $1 = "count" ]; then
	count
fi
