#!/bin/bash

declare -a CSSfiles=(
	"../gs-ui-components/gsuiAudioBlock/gsuiAudioBlock.css"
	"../gs-ui-components/gsuiBeatLines/gsuiBeatLines.css"
	"../gs-ui-components/gsuiGridSamples/gsuiGridSamples.css"
	"../gs-ui-components/gsuiKeys/gsuiKeys.css"
	"../gs-ui-components/gsuiPanels/gsuiPanels.css"
	"../gs-ui-components/gsuiSpanEditable/gsuiSpanEditable.css"
	"../gs-ui-components/gsuiTimeLine/gsuiTimeLine.css"
	"../gs-ui-components/gsuiToggle/gsuiToggle.css"
	"../gs-ui-components/gsuiTrack/gsuiTrack.css"
	"../gs-ui-components/gsuiTrackList/gsuiTrackList.css"
	"src/css/fonts.css"
	"src/css/icon.css"
	"src/css/app.css"
	"src/css/absoluteMenu.css"
	"src/css/panelLeft.css"
	"src/css/panelCmps.css"
	"src/css/cmp.css"
	"src/css/version.css"
	"src/css/action.css"
	"src/css/panelPatterns.css"
	"src/css/panelRight.css"
	"src/css/controls.css"
	"src/css/patternMenu.css"
	"src/css/settingsPopup.css"
)

declare -a HTMLfiles=(
	"src/html/appContent.html"
	"src/html/appCmp.html"
	"../gs-ui-components/gsuiGridSamples/gsuiGridSamples.html"
	"../gs-ui-components/gsuiTimeLine/gsuiTimeLine.html"
	"../gs-ui-components/gsuiKeys/gsuiKeys.html"
	"../gs-ui-components/gsuiTrackList/gsuiTrackList.html"
	"../gs-ui-components/gsuiTrack/gsuiTrack.html"
	"../gs-ui-components/gsuiToggle/gsuiToggle.html"
	"../gs-ui-components/gsuiSpanEditable/gsuiSpanEditable.html"
	"../gs-ui-components/gsuiAudioBlock/gsuiAudioBlock.html"
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
	"../gs-ui-components/gsuiGridSamples/gsuiGridSamples-selection.js"
	"../gs-ui-components/gsuiGridSamples/gsuiGridSamples-deletion.js"
	"../gs-ui-components/gsuiKeys/gsuiKeys.js"
	"../gs-ui-components/gsuiPanels/gsuiPanels.js"
	"../gs-ui-components/gsuiRectMatrix/gsuiRectMatrix.js"
	"../gs-ui-components/gsuiSpanEditable/gsuiSpanEditable.js"
	"../gs-ui-components/gsuiTimeLine/gsuiTimeLine.js"
	"../gs-ui-components/gsuiToggle/gsuiToggle.js"
	"../gs-ui-components/gsuiTrack/gsuiTrack.js"
	"../gs-ui-components/gsuiTrackList/gsuiTrackList.js"

	"../gs-webaudio-library/gswaScheduler/gswaScheduler.js"
	"../gs-webaudio-library/gswaSynth/gswaSynth.js"

	"src/init.js"

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
	"src/gs/loadNewComposition.js"
	"src/gs/loadCompositionById.js"
	"src/gs/loadCompositionByBlob.js"
	"src/gs/exportCompositionToJSON.js"
	"src/gs/getMaxCompositionInnerId.js"
	"src/gs/pushCompositionChange.js"
	"src/gs/changeComposition.js"
	"src/gs/unloadComposition.js"
	"src/gs/deleteComposition.js"
	"src/gs/isCompositionNeedSave.js"
	"src/gs/saveCurrentComposition.js"
	"src/gs/controls.js"
	"src/gs/newPattern.js"
	"src/gs/removePattern.js"
	"src/gs/namePattern.js"
	"src/gs/dropPattern.js"
	"src/gs/updatePatternContent.js"
	"src/gs/addAudioFiles.js"

	"src/wa/init.js"
	"src/wa/grids.js"
	"src/wa/patterns.js"
	"src/wa/keysToScheduleData.js"
	"src/wa/blocksToScheduleData.js"

	"src/ui/init.js"
	"src/ui/keysToRects.js"
	"src/ui/windowEvents.js"
	"src/ui/history.js"
	"src/ui/controls.js"
	"src/ui/mainGrid.js"
	"src/ui/cmps.js"
	"src/ui/patterns.js"
	"src/ui/pattern.js"
	"src/ui/settingsPopup.js"

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
<noscript>GridSound needs JavaScript to run</noscript>\
<div id='app'></div>" >> $filename
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
