#!/bin/bash

declare -a CSSfiles=(
	"../gs-ui-components/gsuiAudioBlock/gsuiAudioBlock.css"
	"../gs-ui-components/gsuiBeatLines/gsuiBeatLines.css"
	"../gs-ui-components/gsuiGridSamples/gsuiGridSamples.css"
	"../gs-ui-components/gsuiKeys/gsuiKeys.css"
	"../gs-ui-components/gsuiPanels/gsuiPanels.css"
	"../gs-ui-components/gsuiPopup/gsuiPopup.css"
	"../gs-ui-components/gsuiSlider/gsuiSlider.css"
	"../gs-ui-components/gsuiSpanEditable/gsuiSpanEditable.css"
	"../gs-ui-components/gsuiTimeLine/gsuiTimeLine.css"
	"../gs-ui-components/gsuiToggle/gsuiToggle.css"
	"../gs-ui-components/gsuiTrack/gsuiTrack.css"
	"../gs-ui-components/gsuiTrackList/gsuiTrackList.css"
	"src/css/fonts.css"
	"src/css/icon.css"
	"src/css/app.css"
	"src/css/popup.css"
	"src/css/absoluteMenu.css"
	"src/css/pan-leftside.css"
	"src/css/pan-rightside.css"
	"src/css/pan-cmps.css"
	"src/css/pan-history.css"
	"src/css/pan-patterns.css"
	"src/css/pan-synth-pianoroll.css"
	"src/css/pan-synth.css"
	"src/css/pan-pianoroll.css"
	"src/css/cmp.css"
	"src/css/synth.css"
	"src/css/version.css"
	"src/css/controls.css"
	"src/css/synthOsc.css"
)

declare -a HTMLfiles=(
	"src/html/_panels.html"
	"src/html/pan-cmps.html"
	"src/html/pan-history.html"
	"src/html/pan-patterns.html"
	"src/html/pan-maingrid.html"
	"src/html/pan-synth.html"
	"src/html/pan-pianoroll.html"
	"src/html/popup-open.html"
	"src/html/popup-settings.html"
	"src/html/popup-shortcuts.html"
	"src/html/synth.html"
	"src/html/synthOsc.html"
	"../gs-ui-components/gsuiAudioBlock/gsuiAudioBlock.html"
	"../gs-ui-components/gsuiGridSamples/gsuiGridSamples.html"
	"../gs-ui-components/gsuiKeys/gsuiKeys.html"
	"../gs-ui-components/gsuiPopup/gsuiPopup.html"
	"../gs-ui-components/gsuiSlider/gsuiSlider.html"
	"../gs-ui-components/gsuiTimeLine/gsuiTimeLine.html"
	"../gs-ui-components/gsuiToggle/gsuiToggle.html"
	"../gs-ui-components/gsuiTrack/gsuiTrack.html"
	"../gs-ui-components/gsuiTrackList/gsuiTrackList.html"
	"../gs-ui-components/gsuiSpanEditable/gsuiSpanEditable.html"
)

declare -a JSfilesProd=(
	"src/initServiceWorker.js"
	"src/checkNewVersion.js"
	"src/gAnalytics.js"
)

declare -a JSfiles=(
	"../gs-ui-components/gsuiAudioBlock/gsuiAudioBlock.js"
	"../gs-ui-components/gsuiBeatLines/gsuiBeatLines.js"
	"../gs-ui-components/gsuiGridSamples/gsuiGridSamples.js"
	"../gs-ui-components/gsuiGridSamples/gsuiGridSamples-blocks.js"
	"../gs-ui-components/gsuiGridSamples/gsuiGridSamples-deletion.js"
	"../gs-ui-components/gsuiGridSamples/gsuiGridSamples-selection.js"
	"../gs-ui-components/gsuiKeys/gsuiKeys.js"
	"../gs-ui-components/gsuiPanels/gsuiPanels.js"
	"../gs-ui-components/gsuiPopup/gsuiPopup.js"
	"../gs-ui-components/gsuiRectMatrix/gsuiRectMatrix.js"
	"../gs-ui-components/gsuiSlider/gsuiSlider.js"
	"../gs-ui-components/gsuiSpanEditable/gsuiSpanEditable.js"
	"../gs-ui-components/gsuiTimeLine/gsuiTimeLine.js"
	"../gs-ui-components/gsuiToggle/gsuiToggle.js"
	"../gs-ui-components/gsuiTrack/gsuiTrack.js"
	"../gs-ui-components/gsuiTrackList/gsuiTrackList.js"
	"../gs-ui-components/gsuiWave/gsuiWave.js"

	"../gs-webaudio-library/gswaEncodeWAV/gswaEncodeWAV.js"
	"../gs-webaudio-library/gswaScheduler/gswaScheduler.js"
	"../gs-webaudio-library/gswaSynth/gswaSynth.js"

	"src/init.js"

	"src/jsonActions/newSynth.js"
	"src/jsonActions/removeSynth.js"
	"src/jsonActions/newPattern.js"
	"src/jsonActions/clonePattern.js"
	"src/jsonActions/removePattern.js"
	"src/jsonActions/patternChangeSynth.js"

	"src/common/deepKeys.js"
	"src/common/uuid.js"
	"src/common/smallId.js"
	"src/common/trim2.js"
	"src/common/nameUnique.js"
	"src/common/time.js"
	"src/common/composeUndo.js"
	"src/common/assignDeep.js"

	"src/gs/init.js"
	"src/gs/undoRedo.js"
	"src/gs/localStorage.js"
	"src/gs/changeSettings.js"
	"src/gs/loadComposition.js"
	"src/gs/handleOldComposition.js"
	"src/gs/loadNewComposition.js"
	"src/gs/loadCompositionById.js"
	"src/gs/loadCompositionByBlob.js"
	"src/gs/loadCompositionByURL.js"
	"src/gs/exportCompositionToJSON.js"
	"src/gs/exportCurrentCompositionToWAV.js"
	"src/gs/getMaxCompositionInnerId.js"
	"src/gs/pushCompositionChange.js"
	"src/gs/changeComposition.js"
	"src/gs/unloadComposition.js"
	"src/gs/deleteComposition.js"
	"src/gs/isCompositionNeedSave.js"
	"src/gs/saveCurrentComposition.js"
	"src/gs/controls.js"
	"src/gs/openPattern.js"
	"src/gs/openSynth.js"
	"src/gs/nameUniqueFrom.js"
	"src/gs/dropPattern.js"
	"src/gs/updatePatternContent.js"
	"src/gs/addAudioFiles.js"

	"src/wa/init.js"
	"src/wa/render.js"
	"src/wa/blocksToScheduleData.js"
	"src/wa/destination.js"
	"src/wa/synths.js"
	"src/wa/grids.js"
	"src/wa/keysToScheduleData.js"
	"src/wa/patterns.js"
	"src/wa/patternKeys.js"

	"src/ui/init.js"
	"src/ui/keysToRects.js"
	"src/ui/windowEvents.js"
	"src/ui/history.js"
	"src/ui/controls.js"
	"src/ui/mainGrid.js"
	"src/ui/cmps.js"
	"src/ui/patterns.js"
	"src/ui/pattern.js"
	"src/ui/synth.js"
	"src/ui/synths.js"
	"src/ui/openPopup.js"
	"src/ui/settingsPopup.js"
	"src/ui/shortcutsPopup.js"

	"src/run.js"
)

HTMLheader() {
	echo -en \
"<!DOCTYPE html>\
<html lang='en'><head>\
<title>GridSound</title>\
<meta charset='UTF-8'/>\
<meta name='viewport' content='width=device-width, user-scalable=no'/>\
<meta name='description' content='A free and Open-Source DAW (digital audio workstation)'/>\
<meta name='google' content='notranslate'/>\
<meta property='og:type' content='website'/>\
<meta property='og:title' content='GridSound (an open-source digital audio workstation)'/>\
<meta property='og:url' content='https://gridsound.github.io/'/>\
<meta property='og:image' content='https://gridsound.github.io/assets/og-image.jpg'/>\
<meta property='og:image:width' content='800'/>\
<meta property='og:image:height' content='400'/>\
<meta name='theme-color' content='#3a5158'/>\
<link rel='manifest' href='manifest.json'/>\
<link rel='shortcut icon' href='assets/favicon.png'/>" > $filename
}

HTMLbody() {
	echo -en \
"</head><body>\
<noscript>GridSound needs JavaScript to run</noscript>" >> $filename
	for i in "${HTMLfiles[@]}"
	do
		cat $i | tr -d '\t\n\r' >> $filename
	done
}

buildDev() {
	filename="index.html"
	echo "Build $filename"
	HTMLheader
	for i in "${CSSfiles[@]}"
	do
		echo -n "<link rel='stylesheet' href='$i'/>" >> $filename
	done
	HTMLbody
	echo -n "<script>function lg( a ) { return console.log.apply( console, arguments ), a; }</script>" >> $filename
	for i in "${JSfiles[@]}"
	do
		echo -n "<script src='$i'></script>" >> $filename
	done
	echo "</body></html>" >> $filename
}

buildMaster() {
	filename="index-gh-pages.html"
	echo "Build $filename"
	HTMLheader
	echo -n "<style>" >> $filename
	cat `for i in ${CSSfiles[@]}; do echo -n $i ""; done` | csso | sed "s/..\/..\/assets/assets/g" >> $filename
	echo -n "</style>" >> $filename
	HTMLbody
	echo -n "<script>" >> $filename
	# TODO: use the `--mangle-props` option
	jsProdFiles=( "${JSfiles[@]}" "${JSfilesProd[@]}" )
	uglifyjs `for i in ${jsProdFiles[@]}; do echo -n $i ""; done` --compress --mangle >> $filename
	echo "</script></body></html>" >> $filename
}

if [ $# -gt 0 ] && [ $1 = "gh-pages" ]
then
	buildMaster
else
	buildDev
fi
