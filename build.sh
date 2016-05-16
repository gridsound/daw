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
		ui/removeWhitespaces.js   \
		ui/initBefore.js          \
		ui/getGridXem.js          \
		ui/analyserToggle.js      \
		ui/playFile.js            \
		ui/playPauseStop.js       \
		ui/selectTool.js          \
		ui/bpm.js                 \
		ui/currentTime.js         \
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
		ui/Sample/updateCSS.js    \
		                          \
		wa/init.js                \
		wa/oscilloscope.js        \
		wa/compositionLoop.js     \
		                          \
		gs/_init.js               \
		gs/bpm.js                 \
		gs/currentTime.js         \
		gs/playPauseStop.js       \
		                          \
		gs/events/bpm.js          \
		gs/events/currentTime.js  \
		gs/events/divExtend.js    \
		gs/events/dropFiles.js    \
		gs/events/gridMouse.js    \
		gs/events/keyboard.js     \
		gs/events/playPauseStop.js\
		gs/events/resize.js       \
		gs/events/tools.js        \
		gs/events/toolDelete.js   \
		gs/events/toolHand.js     \
		gs/events/toolMute.js     \
		gs/events/toolPaint.js    \
		gs/events/toolSelect.js   \
		gs/events/toolSlip.js     \
		gs/events/toolZoom.js     \
		                          \
		ui/initAfter.js           \
		                          \
		-o compressed.js          \
		--compress                \
		--mangle
fi
