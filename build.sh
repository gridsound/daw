#!/bin/bash

writeHeader() {
	echo '<!DOCTYPE html>'
	echo '<html lang="en">'
	echo '<head>'
	echo '<title>GridSound</title>'
	echo '<meta charset="UTF-8"/>'
	echo '<meta name="viewport" content="width=device-width, user-scalable=no"/>'
	echo '<meta name="description" content="A free and Open-Source DAW (digital audio workstation)"/>'
	echo '<meta name="google" content="notranslate"/>'
	echo '<meta property="og:type" content="website"/>'
	echo '<meta property="og:title" content="GridSound"/>'
	echo '<meta property="og:url" content="https://gridsound.com/daw/"/>'
	echo '<meta property="og:image" content="https://gridsound.com/assets/og-image.jpg"/>'
	echo '<meta property="og:image:width" content="800"/>'
	echo '<meta property="og:image:height" content="400"/>'
	echo '<meta property="og:description" content="a free and open source DAW (digital audio workstation)"/>'
	echo '<meta name="theme-color" content="#3a5158"/>'
	echo '<link rel="manifest" href="manifest.json"/>'
	echo '<link rel="shortcut icon" href="../assets/favicon.png"/>'
}
writeBody() {
	echo '</head>'
	echo '<body>'
	echo '<noscript id="noscript">GridSound needs JavaScript to run</noscript>'
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
	terser allJS.js --compress --mangle --toplevel
	echo '</script>'
	rm allJS.js
}

declare -a CSSfiles=(
	"gs-ui-components/gsui.css"
	"gs-ui-components/gsuiIcon/gsuiIcon.css"
	"gs-ui-components/gsuiDAW/gsuiDAW.colors.default.css"
	"gs-ui-components/gsuiDAW/gsuiDAW.css"
	"gs-ui-components/gsuiDAW/gsuiDAW-btn.css"
	"gs-ui-components/gsuiDAW/gsuiDAW-cmp.css"
	"gs-ui-components/gsuiDAW/gsuiDAW-dropdown.css"
	"gs-ui-components/gsuiDAW/gsuiDAW-area-user.css"
	"gs-ui-components/gsuiDAW/gsuiDAW-area-save.css"
	"gs-ui-components/gsuiDAW/gsuiDAW-area-ctrl.css"
	"gs-ui-components/gsuiDAW/gsuiDAW-area-time.css"
	"gs-ui-components/gsuiDAW/gsuiDAW-area-hist.css"
	"gs-ui-components/gsuiDAW/gsuiDAW-area-wins.css"
	"gs-ui-components/gsuiDAW/gsuiDAW-area-help.css"
	"gs-ui-components/gsuiDAW/gsuiDAW-area-vers.css"
	"gs-ui-components/gsuiDAW/gsuiDAW-popup-auth.css"
	"gs-ui-components/gsuiDAW/gsuiDAW-popup-open.css"
	"gs-ui-components/gsuiDAW/gsuiDAW-popup-about.css"
	"gs-ui-components/gsuiDAW/gsuiDAW-popup-tempo.css"
	"gs-ui-components/gsuiDAW/gsuiDAW-popup-export.css"
	"gs-ui-components/gsuiDAW/gsuiDAW-popup-cookies.css"
	"gs-ui-components/gsuiDAW/gsuiDAW-popup-settings.css"
	"gs-ui-components/gsuiDAW/gsuiDAW-popup-shortcuts.css"
	"gs-ui-components/gsuiSpectrum/gsuiSpectrum.css"
	"gs-ui-components/gsuiDragshield/gsuiDragshield.css"
	"gs-ui-components/gsuiEnvelopeGraph/gsuiEnvelopeGraph.css"
	"gs-ui-components/gsuiEnvelope/gsuiEnvelope.colors.default.css"
	"gs-ui-components/gsuiEnvelope/gsuiEnvelope.css"
	"gs-ui-components/gsuiLFO/gsuiLFO.colors.default.css"
	"gs-ui-components/gsuiLFO/gsuiLFO.css"
	"gs-ui-components/gsuiDrumrows/gsuiDrumrows.colors.default.css"
	"gs-ui-components/gsuiDrumrows/gsuiDrumrows.css"
	"gs-ui-components/gsuiDrums/gsuiDrums.colors.default.css"
	"gs-ui-components/gsuiDrums/gsuiDrums.css"
	"gs-ui-components/gsuiClock/gsuiClock.colors.default.css"
	"gs-ui-components/gsuiClock/gsuiClock.css"
	"gs-ui-components/gsuiChannel/gsuiChannel.colors.default.css"
	"gs-ui-components/gsuiChannel/gsuiChannel.css"
	"gs-ui-components/gsuiChannels/gsuiChannels.colors.default.css"
	"gs-ui-components/gsuiChannels/gsuiChannels.css"
	"gs-ui-components/gsuiCurves/gsuiCurves.css"
	"gs-ui-components/gsuiEffects/gsuiEffects.css"
	"gs-ui-components/gsuiFxFilter/gsuiFxFilter.colors.default.css"
	"gs-ui-components/gsuiFxFilter/gsuiFxFilter.css"
	"gs-ui-components/gsuiReorder/gsuiReorder.css"
	"gs-ui-components/gsuiDragline/gsuiDragline.css"
	"gs-ui-components/gsuiBeatlines/gsuiBeatlines.css"
	"gs-ui-components/gsuiBlocksManager/gsuiBlocksManager.css"
	"gs-ui-components/gsuiPatternroll/gsuiPatternroll.css"
	"gs-ui-components/gsuiPianoroll/gsuiPianoroll.css"
	"gs-ui-components/gsuiPianoroll/gsuiPianoroll-block.css"
	"gs-ui-components/gsuiKeys/gsuiKeys.colors.default.css"
	"gs-ui-components/gsuiKeys/gsuiKeys.css"
	"gs-ui-components/gsuiOscillator/gsuiOscillator.colors.default.css"
	"gs-ui-components/gsuiOscillator/gsuiOscillator.css"
	"gs-ui-components/gsuiPeriodicWave/gsuiPeriodicWave.css"
	"gs-ui-components/gsuiSynthesizer/gsuiSynthesizer.colors.default.css"
	"gs-ui-components/gsuiSynthesizer/gsuiSynthesizer.css"
	"gs-ui-components/gsuiDotline/gsuiDotline.css"
	"gs-ui-components/gsuiPanels/gsuiPanels.colors.default.css"
	"gs-ui-components/gsuiPanels/gsuiPanels.css"
	"gs-ui-components/gsuiPopup/gsuiPopup.colors.default.css"
	"gs-ui-components/gsuiPopup/gsuiPopup.css"
	"gs-ui-components/gsuiSlicer/gsuiSlicer.colors.default.css"
	"gs-ui-components/gsuiSlicer/gsuiSlicer.css"
	"gs-ui-components/gsuiSlider/gsuiSlider.css"
	"gs-ui-components/gsuiSliderGroup/gsuiSliderGroup.colors.default.css"
	"gs-ui-components/gsuiSliderGroup/gsuiSliderGroup.css"
	"gs-ui-components/gsuiTimeline/gsuiTimeline.colors.default.css"
	"gs-ui-components/gsuiTimeline/gsuiTimeline.css"
	"gs-ui-components/gsuiTimewindow/gsuiTimewindow.colors.default.css"
	"gs-ui-components/gsuiTimewindow/gsuiTimewindow.css"
	"gs-ui-components/gsuiPatterns/gsuiPatterns.colors.default.css"
	"gs-ui-components/gsuiPatterns/gsuiPatterns.css"
	"gs-ui-components/gsuiPatterns/gsuiPatterns-synth.css"
	"gs-ui-components/gsuiPatterns/gsuiPatterns-pattern.css"
	"gs-ui-components/gsuiTrack/gsuiTrack.colors.default.css"
	"gs-ui-components/gsuiTrack/gsuiTrack.css"
	"gs-ui-components/gsuiWindows/gsuiWindow.colors.default.css"
	"gs-ui-components/gsuiWindows/gsuiWindows.css"
	"gs-ui-components/gsuiWindows/gsuiWindow.css"

	"assets/fonts/fonts.css"

	"src/css/reset.css"
	"src/css/textGlitch.css"
	"src/css/loading.css"
	"src/css/window.css"
	"src/css/windows.css"
)

declare -a JSfilesProd=(
	"src/initServiceWorker.js"
)

declare -a JSfiles=(
	"src/checkBrowser.js"

	"gs-api-client/gsapiClient.js"

	"daw-core/src/DAWCore.js"
	"daw-core/src/Buffers.js"
	"daw-core/src/BuffersSlices.js"
	"daw-core/src/LocalStorage.js"
	"daw-core/src/Destination.js"
	"daw-core/src/History.js"
	"daw-core/src/History.prototype.nameAction.js"
	"daw-core/src/Keys.js"
	"daw-core/src/Drums.js"
	"daw-core/src/Slices.js"
	"daw-core/src/Composition.js"
	"daw-core/src/Composition.epure.js"
	"daw-core/src/Composition.format.js"
	"daw-core/src/Composition.prototype.change.js"

	"daw-core/src/utils/addIfNotEmpty.js"
	"daw-core/src/utils/castToNumber.js"
	"daw-core/src/utils/composeUndo.js"
	"daw-core/src/utils/createUpdateDelete.js"
	"daw-core/src/utils/deepAssign.js"
	"daw-core/src/utils/deepCopy.js"
	"daw-core/src/utils/deepFreeze.js"
	"daw-core/src/utils/diffAssign.js"
	"daw-core/src/utils/isEmpty.js"
	"daw-core/src/utils/isntEmpty.js"
	"daw-core/src/utils/isObject.js"
	"daw-core/src/utils/jsonCopy.js"
	"daw-core/src/utils/mapCallbacks.js"
	"daw-core/src/utils/noop.js"
	"daw-core/src/utils/panningMerge.js"
	"daw-core/src/utils/panningMergeLR.js"
	"daw-core/src/utils/panningSplitLR.js"
	"daw-core/src/utils/plural.js"
	"daw-core/src/utils/trim2.js"
	"daw-core/src/utils/uniqueName.js"
	"daw-core/src/utils/uuid.js"

	"daw-core/src/json/composition.js"
	"daw-core/src/json/block.js"
	"daw-core/src/json/channel.js"
	"daw-core/src/json/channelMain.js"
	"daw-core/src/json/channels.js"
	"daw-core/src/json/drum.js"
	"daw-core/src/json/drumcut.js"
	"daw-core/src/json/drumrow.js"
	"daw-core/src/json/effects.filter.js"
	"daw-core/src/json/env.js"
	"daw-core/src/json/key.js"
	"daw-core/src/json/lfo.js"
	"daw-core/src/json/oscillator.js"
	"daw-core/src/json/synth.js"
	"daw-core/src/json/track.js"

	"daw-core/src/controllers/blocks.js"
	"daw-core/src/controllers/drumrows.js"
	"daw-core/src/controllers/drums.js"
	"daw-core/src/controllers/effects.js"
	"daw-core/src/controllers/keys.js"
	"daw-core/src/controllers/mixer.js"
	"daw-core/src/controllers/synth.js"
	"daw-core/src/controllers/tracks.js"
	"daw-core/src/controllers/slicer.js"
	"daw-core/src/controllersFx/filter.js"

	"daw-core/src/actions/common/patternOpenedByType.js"
	"daw-core/src/actions/common/calcNewDuration.js"
	"daw-core/src/actions/common/calcNewKeysDuration.js"
	"daw-core/src/actions/common/createUniqueName.js"
	"daw-core/src/actions/common/getDrumrowName.js"
	"daw-core/src/actions/common/getNextIdOf.js"
	"daw-core/src/actions/common/getNextOrderOf.js"
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
	"daw-core/src/actions/addPatternDrums.js"
	"daw-core/src/actions/addPatternKeys.js"
	"daw-core/src/actions/addPatternSlices.js"
	"daw-core/src/actions/addSynth.js"
	"daw-core/src/actions/changeChannel.js"
	"daw-core/src/actions/changeDrumrow.js"
	"daw-core/src/actions/changeDrumrowPattern.js"
	"daw-core/src/actions/changeDrumsProps.js"
	"daw-core/src/actions/changeEffect.js"
	"daw-core/src/actions/changeEnv.js"
	"daw-core/src/actions/changeKeysProps.js"
	"daw-core/src/actions/changeLFO.js"
	"daw-core/src/actions/changeLoop.js"
	"daw-core/src/actions/changeOscillator.js"
	"daw-core/src/actions/changePatternBufferInfo.js"
	"daw-core/src/actions/changePatternSlices.js"
	"daw-core/src/actions/changeTempo.js"
	"daw-core/src/actions/clonePattern.js"
	"daw-core/src/actions/cloneSelectedKeys.js"
	"daw-core/src/actions/closePattern.js"
	"daw-core/src/actions/cropEndBlocks.js"
	"daw-core/src/actions/cropEndKeys.js"
	"daw-core/src/actions/cropStartBlocks.js"
	"daw-core/src/actions/dropBuffers.js"
	"daw-core/src/actions/duplicateSelectedBlocks.js"
	"daw-core/src/actions/moveBlocks.js"
	"daw-core/src/actions/moveKeys.js"
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
	"daw-core/src/actions/toggleSoloDrumrow.js"
	"daw-core/src/actions/toggleSoloTrack.js"
	"daw-core/src/actions/toggleTrack.js"
	"daw-core/src/actions/unselectAllBlocks.js"
	"daw-core/src/actions/unselectAllKeys.js"
	"daw-core/src/actions/unselectBlock.js"
	"daw-core/src/actions/unselectKey.js"

	"daw-core/src/prototype/abortWAVExport.js"
	"daw-core/src/prototype/addComposition.js"
	"daw-core/src/prototype/addCompositionByBlob.js"
	"daw-core/src/prototype/addCompositionByJSON.js"
	"daw-core/src/prototype/addCompositionByURL.js"
	"daw-core/src/prototype/addCompositionsFromLocalStorage.js"
	"daw-core/src/prototype/addNewComposition.js"
	"daw-core/src/prototype/closeComposition.js"
	"daw-core/src/prototype/deleteComposition.js"
	"daw-core/src/prototype/dropAudioFiles.js"
	"daw-core/src/prototype/exportCompositionToJSON.js"
	"daw-core/src/prototype/exportCompositionToWAV.js"
	"daw-core/src/prototype/liveChangeChannel.js"
	"daw-core/src/prototype/liveChangeEffect.js"
	"daw-core/src/prototype/liveChangeSynth.js"
	"daw-core/src/prototype/newComposition.js"
	"daw-core/src/prototype/openComposition.js"
	"daw-core/src/prototype/saveComposition.js"

	"gs-components/gsDrums/gsDrums.js"
	"gs-components/gsEffects/gsEffects.js"
	"gs-components/gsMixer/gsMixer.js"
	"gs-components/gsPatternroll/gsPatternroll.js"
	"gs-components/gsPatterns/gsPatterns.js"
	"gs-components/gsPianoroll/gsPianoroll.js"
	"gs-components/gsSynth/gsSynth.js"
	"gs-components/gsSlicer/gsSlicer.js"

	"gs-wa-components/gswaLFO/gswaLFO.js"
	"gs-wa-components/gswaEnvelope/gswaEnvelope.js"
	"gs-wa-components/gswaMixer/gswaMixer.js"
	"gs-wa-components/gswaSynth/gswaSynth.js"
	"gs-wa-components/gswaKeysScheduler/gswaKeysScheduler.js"
	"gs-wa-components/gswaDrumsScheduler/gswaDrumsScheduler.js"
	"gs-wa-components/gswaSlicer/gswaSlicer.js"
	"gs-wa-components/gswaBPMTap/gswaBPMTap.js"
	"gs-wa-components/gswaEffects/gswaEffects.js"
	"gs-wa-components/gswaFxFilter/gswaFxFilter.js"
	"gs-wa-components/gswaDrumrows/gswaDrumrows.js"
	"gs-wa-components/gswaScheduler/gswaScheduler.js"
	"gs-wa-components/gswaEncodeWAV/gswaEncodeWAV.js"
	"gs-wa-components/gswaStereoPanner/gswaStereoPanner.js"
	"gs-wa-components/gswaPeriodicWaves/gswaPeriodicWaves.js"
	"gs-wa-components/gswaPeriodicWaves/gswaPeriodicWaves.list.js"

	"gs-ui-components/gsui.js"
	"gs-ui-components/gsuiDAW/gsuiDAW.html.js"
	"gs-ui-components/gsuiDAW/gsuiDAW-popup-auth.html.js"
	"gs-ui-components/gsuiDAW/gsuiDAW-popup-open.html.js"
	"gs-ui-components/gsuiDAW/gsuiDAW-popup-about.html.js"
	"gs-ui-components/gsuiDAW/gsuiDAW-popup-tempo.html.js"
	"gs-ui-components/gsuiDAW/gsuiDAW-popup-export.html.js"
	"gs-ui-components/gsuiDAW/gsuiDAW-popup-cookies.html.js"
	"gs-ui-components/gsuiDAW/gsuiDAW-popup-settings.html.js"
	"gs-ui-components/gsuiDAW/gsuiDAW-popup-shortcuts.html.js"
	"gs-ui-components/gsuiDAW/gsuiDAW.js"
	"gs-ui-components/gsuiDragshield/gsuiDragshield.js"
	"gs-ui-components/gsuiEnvelopeGraph/gsuiEnvelopeGraph.js"
	"gs-ui-components/gsuiEnvelope/gsuiEnvelope.html.js"
	"gs-ui-components/gsuiEnvelope/gsuiEnvelope.js"
	"gs-ui-components/gsuiLFO/gsuiLFO.html.js"
	"gs-ui-components/gsuiLFO/gsuiLFO.js"
	"gs-ui-components/gsuiClock/gsuiClock.html.js"
	"gs-ui-components/gsuiClock/gsuiClock.js"
	"gs-ui-components/gsuiChannel/gsuiChannel.html.js"
	"gs-ui-components/gsuiChannel/gsuiChannel.js"
	"gs-ui-components/gsuiChannels/gsuiChannels.html.js"
	"gs-ui-components/gsuiChannels/gsuiChannels.js"
	"gs-ui-components/gsuiCurves/gsuiCurves.html.js"
	"gs-ui-components/gsuiCurves/gsuiCurves.js"
	"gs-ui-components/gsuiEffects/gsuiEffects.html.js"
	"gs-ui-components/gsuiEffects/gsuiEffects.js"
	"gs-ui-components/gsuiFxFilter/gsuiFxFilter.html.js"
	"gs-ui-components/gsuiFxFilter/gsuiFxFilter.js"
	"gs-ui-components/gsuiReorder/gsuiReorder.js"
	"gs-ui-components/gsuiReorder/gsuiReorder.listReorder.js"
	"gs-ui-components/gsuiReorder/gsuiReorder.listComputeOrderChange.js"
	"gs-ui-components/gsuiDragline/gsuiDragline.html.js"
	"gs-ui-components/gsuiDragline/gsuiDragline.js"
	"gs-ui-components/gsuiBeatlines/gsuiBeatlines.js"
	"gs-ui-components/gsuiBlocksManager/gsuiBlocksManager.js"
	"gs-ui-components/gsuiPatternroll/gsuiPatternroll.html.js"
	"gs-ui-components/gsuiPatternroll/gsuiPatternroll.js"
	"gs-ui-components/gsuiPianoroll/gsuiPianoroll.html.js"
	"gs-ui-components/gsuiPianoroll/gsuiPianoroll.js"
	"gs-ui-components/gsuiDrumrows/gsuiDrumrows.html.js"
	"gs-ui-components/gsuiDrumrows/gsuiDrumrows.js"
	"gs-ui-components/gsuiDrums/gsuiDrums.html.js"
	"gs-ui-components/gsuiDrums/gsuiDrums.js"
	"gs-ui-components/gsuiKeys/gsuiKeys.html.js"
	"gs-ui-components/gsuiKeys/gsuiKeys.js"
	"gs-ui-components/gsuiOscillator/gsuiOscillator.html.js"
	"gs-ui-components/gsuiOscillator/gsuiOscillator.js"
	"gs-ui-components/gsuiPeriodicWave/gsuiPeriodicWave.js"
	"gs-ui-components/gsuiSynthesizer/gsuiSynthesizer.html.js"
	"gs-ui-components/gsuiSynthesizer/gsuiSynthesizer.js"
	"gs-ui-components/gsuiDotline/gsuiDotline.js"
	"gs-ui-components/gsuiPanels/gsuiPanels.js"
	"gs-ui-components/gsuiPopup/gsuiPopup.html.js"
	"gs-ui-components/gsuiPopup/gsuiPopup.js"
	"gs-ui-components/gsuiSlicer/gsuiSlicer.html.js"
	"gs-ui-components/gsuiSlicer/gsuiSlicer.js"
	"gs-ui-components/gsuiSlider/gsuiSlider.html.js"
	"gs-ui-components/gsuiSlider/gsuiSlider.js"
	"gs-ui-components/gsuiSliderGroup/gsuiSliderGroup.html.js"
	"gs-ui-components/gsuiSliderGroup/gsuiSliderGroup.js"
	"gs-ui-components/gsuiTimeline/gsuiTimeline.html.js"
	"gs-ui-components/gsuiTimeline/gsuiTimeline.js"
	"gs-ui-components/gsuiTimewindow/gsuiTimewindow.html.js"
	"gs-ui-components/gsuiTimewindow/gsuiTimewindow.js"
	"gs-ui-components/gsuiPatterns/gsuiPatterns-infoPopup.html.js"
	"gs-ui-components/gsuiPatterns/gsuiPatterns-pattern.html.js"
	"gs-ui-components/gsuiPatterns/gsuiPatterns-synth.html.js"
	"gs-ui-components/gsuiPatterns/gsuiPatterns.html.js"
	"gs-ui-components/gsuiPatterns/gsuiPatterns.js"
	"gs-ui-components/gsuiTrack/gsuiTrack.html.js"
	"gs-ui-components/gsuiTrack/gsuiTrack.js"
	"gs-ui-components/gsuiTracklist/gsuiTracklist.js"
	"gs-ui-components/gsuiAnalyser/gsuiAnalyser.js"
	"gs-ui-components/gsuiSpectrum/gsuiSpectrum.js"
	"gs-ui-components/gsuiSVGDefs/gsuiSVGDefs.js"
	"gs-ui-components/gsuiWaveform/gsuiWaveform.js"
	"gs-ui-components/gsuiWaveform/gsuiWaveform.draw.js"
	"gs-ui-components/gsuiWaveforms/gsuiWaveforms.js"
	"gs-ui-components/gsuiKeysforms/gsuiKeysforms.js"
	"gs-ui-components/gsuiDrumsforms/gsuiDrumsforms.js"
	"gs-ui-components/gsuiSlicesforms/gsuiSlicesforms.js"
	"gs-ui-components/gsuiWindows/gsuiWindows.js"
	"gs-ui-components/gsuiWindows/gsuiWindow.html.js"
	"gs-ui-components/gsuiWindows/gsuiWindow.js"

	"src/html/windows/blocks.html.js"
	"src/html/windows/drums.html.js"
	"src/html/windows/effects.html.js"
	"src/html/windows/mixer.html.js"
	"src/html/windows/patternroll.html.js"
	"src/html/windows/pianoroll.html.js"
	"src/html/windows/slicer.html.js"
	"src/html/windows/synth.html.js"

	"src/ui/textGlitch.js"
	"src/ui/loading.js"
	"src/ui/auth.js"
	"src/ui/drop.js"
	"src/ui/drums.js"
	"src/ui/title.js"
	"src/ui/synth.js"
	"src/ui/mixer.js"
	"src/ui/slicer.js"
	"src/ui/effects.js"
	"src/ui/windows.js"
	"src/ui/patterns.js"
	"src/ui/controls.js"
	"src/ui/keyboard.js"
	"src/ui/pianoroll.js"
	"src/ui/patternroll.js"
	"src/ui/compositions.js"
	"src/ui/compositionChanged.js"
	"src/run.js"
)

buildDev() {
	filename='index.html'
	echo "Build $filename"
	writeHeader > $filename
	writeCSS >> $filename
	writeBody >> $filename
	cat src/html/loading.html >> $filename
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
	cat src/html/loading.html >> $filename
	writeJScompress >> $filename
	writeEnd >> $filename
}

buildTests() {
	filename='tests.html'
	echo "Build $filename"
	writeHeader > $filename
	writeCSScompress >> $filename
	echo '<link rel="stylesheet" href="assets/qunit/qunit-2.9.2.css"/>' >> $filename
	echo '<link rel="stylesheet" href="tests/tests.css"/>' >> $filename
	writeBody >> $filename
	echo '<div id="qunit"></div>' >> $filename
	echo '<div id="qunit-fixture"></div>' >> $filename
	cat src/html/loading.html >> $filename
	writeJScompress >> $filename
	echo '<script src="assets/qunit/qunit-2.9.2.js"></script>' >> $filename
	echo '<script src="tests/tests.js"></script>' >> $filename
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
	find ../daw/src/          -name '*.js'                        -exec wc -l {} \; | cut -d' ' -f1 | awk '{s+=$1} END {printf "* daw              %4.0f JS lines\n", s}'
	find ../daw/src/          -name '*.css'                       -exec wc -l {} \; | cut -d' ' -f1 | awk '{s+=$1} END {printf "                   %4.0f CSS lines\n", s}'
	find ../daw/src/          -name '*.js' -not -name '*.html.js' -exec wc -l {} \; | cut -d' ' -f1 | awk '{s+=$1} END {printf "                   %4.0f HTML lines\n\n", s}'
	find ../daw-core/         -name '*.js'                        -exec wc -l {} \; | cut -d' ' -f1 | awk '{s+=$1} END {printf "* daw-core         %4.0f JS lines\n\n", s}'
	find ../gs-components/    -name '*.js'                        -exec wc -l {} \; | cut -d' ' -f1 | awk '{s+=$1} END {printf "* gs-component     %4.0f JS lines\n\n", s}'
	find ../gs-wa-components/ -name '*.js'                        -exec wc -l {} \; | cut -d' ' -f1 | awk '{s+=$1} END {printf "* gs-wa-components %4.0f JS lines\n\n", s}'
	find ../gs-ui-components/ -name '*.js' -not -name '*.html.js' -exec wc -l {} \; | cut -d' ' -f1 | awk '{s+=$1} END {printf "* gs-ui-components %4.0f JS lines\n", s}'
	find ../gs-ui-components/ -name '*.css'                       -exec wc -l {} \; | cut -d' ' -f1 | awk '{s+=$1} END {printf "                   %4.0f CSS lines\n", s}'
	find ../gs-ui-components/ -name '*.html.js'                   -exec wc -l {} \; | cut -d' ' -f1 | awk '{s+=$1} END {printf "                   %4.0f HTML lines\n", s}'
}

if [ $# = 0 ]; then
	echo '          --------------------------------'
	echo '        .:: GridSound build shell-script ::.'
	echo '        ------------------------------------'
	echo ''
	echo './build.sh dev ---> create "index.html" for development'
	echo './build.sh prod --> create "index-prod.html" for production'
	echo './build.sh tests -> create "tests.html" for testing'
	echo './build.sh lint --> launch the JS/CSS linters (ESLint and Stylelint)'
	echo './build.sh dep ---> update all the submodules'
elif [ $1 = "dep" ]; then
	updateDep
elif [ $1 = "dev" ]; then
	buildDev
elif [ $1 = "prod" ]; then
	buildProd
elif [ $1 = "tests" ]; then
	buildTests
elif [ $1 = "lint" ]; then
	lint
elif [ $1 = "count" ]; then
	count
fi
