#!/bin/bash

# Build the big `style.css` file.
if [[ -z $1 || $1 == "css" ]]; then
	echo "Compressing CSS...";
	cd css;
	# Removing temporarely the Jekyll's frontmatter of the main SCSS file.
	tail -n +3 style.scss > _style.scss;
	sass _style.scss style.css;
	rm _style.scss;
	cd ..;
fi

# Build the big `script.js` file.
if [[ -z $1 || $1 == "js" ]]; then
	echo "Compressing JS...";
	uglifyjs \
		                          \
		../webaudio-library/src/walcontext.js  \
		../webaudio-library/src/composition.js \
		../webaudio-library/src/buffer.js      \
		../webaudio-library/src/waveform.js    \
		../webaudio-library/src/filters.js     \
		../webaudio-library/src/sample.js      \
		                          \
		wa/init.js                \
		wa/oscilloscope.js        \
		wa/compositionLoop.js     \
		                          \
		ui/removeWhitespaces.js   \
		ui/initBefore.js          \
		ui/analyserToggle.js      \
		ui/playFile.js            \
		ui/playComposition.js     \
		ui/getGridPosition.js     \
		ui/selectTool.js          \
		ui/setBPM.js              \
		ui/setClockTime.js        \
		ui/setCursorTime.js       \
		ui/setGridTop.js          \
		ui/setGridZoom.js         \
		ui/setFilesWidth.js       \
		ui/setTrackLinesLeft.js   \
		ui/setTrackNamesWidth.js  \
		ui/updateTimeline.js      \
		ui/updateTrackLinesBg.js  \
		ui/updateGridBoxShadow.js \
		ui/resize.js              \
		ui/toggleTracks.js        \
		ui/toggleMagnetism.js     \
		ui/newFile.js             \
		ui/newTrack.js            \
		ui/sampleCreate.js        \
		ui/sampleSelect.js        \
		ui/sampleDelete.js        \
		ui/samplesForEach.js      \
		ui/samplesFixPosition.js  \
		ui/samplesMoveX.js        \
		ui/samplesSlip.js         \
		ui/samplesUnselect.js     \
		                          \
		ui/File/constructor.js    \
		ui/File/dragstart.js      \
		ui/File/loaded.js         \
		                          \
		ui/Track/constructor.js   \
		ui/Track/editName.js      \
		ui/Track/toggle.js        \
		                          \
		ui/Sample/constructor.js  \
		ui/Sample/when.js         \
		ui/Sample/slip.js         \
		ui/Sample/mute.js         \
		ui/Sample/select.js       \
		ui/Sample/delete.js       \
		ui/Sample/inTrack.js      \
		ui/Sample/moveX.js        \
		ui/Sample/updateBPMem.js  \
		ui/Sample/updateCSS.js    \
		                          \
		ui/events/bpm.js          \
		ui/events/divExtend.js    \
		ui/events/dropFiles.js    \
		ui/events/gridMouse.js    \
		ui/events/keyboard.js     \
		ui/events/playStop.js     \
		ui/events/resize.js       \
		ui/events/tools.js        \
		ui/events/toolDelete.js   \
		ui/events/toolHand.js     \
		ui/events/toolMute.js     \
		ui/events/toolPaint.js    \
		ui/events/toolSelect.js   \
		ui/events/toolSlip.js     \
		ui/events/toolZoom.js     \
		                          \
		ui/initAfter.js           \
		                          \
		-o compressed.js          \
		--compress                \
		--mangle
fi
