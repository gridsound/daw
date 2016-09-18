#!/bin/bash

#  _____     _   _ _____               _
# |   __|___|_|_| |   __|___ _ _ ___ _| |
# |  |  |  _| | . |__   | . | | |   | . |
# |_____|_| |_|___|_____|___|___|_|_|___|.com
#

# Handlebars's templates
if [[ -z $1 || $1 == "html" ]]; then
	echo "Compressing HTML...";
	handlebars templates -f templates/__precompiled.js
fi

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
		jstools/isSameArray.js                 \
		jstools/keyboardRouter.min.js          \
		jstools/wisdom.js                      \
		jstools/handlebars.runtime.min.js      \
		templates/__precompiled.js             \
		                                       \
		../webaudio-library/src/walcontext.js  \
		../webaudio-library/src/composition.js \
		../webaudio-library/src/buffer.js      \
		../webaudio-library/src/waveform.js    \
		../webaudio-library/src/filters.js     \
		../webaudio-library/src/sample.js      \
		                                       \
		ui/_init.js                       \
		ui/analyserToggle.js              \
		ui/bpm.js                         \
		ui/setClockUnit.js                \
		ui/currentTime.js                 \
		ui/cursor.js                      \
		ui/getGridSec.js                  \
		ui/getTrackFromPageY.js           \
		ui/file.js                        \
		ui/history.js                     \
		ui/newTrack.js                    \
		ui/panelSection.js                \
		ui/playPauseStop.js               \
		ui/resize.js                      \
		ui/sample.js                      \
		ui/selectTool.js                  \
		ui/setFilesWidth.js               \
		ui/setGridScrollTop.js            \
		ui/setGridZoom.js                 \
		ui/setTrackLinesLeft.js           \
		ui/setTrackNamesWidth.js          \
		ui/toggleMagnetism.js             \
		ui/toggleTracks.js                \
		ui/updateGridShadows.js           \
		ui/updateTimeline.js              \
		ui/updateTrackLinesBg.js          \
		                                  \
		ui/Track/constructor.js           \
		ui/Track/editName.js              \
		ui/Track/toggle.js                \
		                                  \
		wa/_init.js                       \
		wa/oscilloscope.js                \
		                                  \
		gs/_init.js                       \
		gs/bpm.js                         \
		gs/currentTime.js                 \
		gs/playPauseStop.js               \
		gs/load.js                        \
		gs/save.js                        \
		gs/reset.js                       \
		                                  \
		gs/files/fileCreate.js            \
		gs/files/fileDelete.js            \
		gs/files/filePlayStop.js          \
		gs/files/File/constructor.js      \
		gs/files/File/delete.js           \
		gs/files/File/dragstart.js        \
		gs/files/File/joinFile.js         \
		gs/files/File/load.js             \
		                                  \
		gs/history/history.js             \
		gs/history/actions.js             \
		                                  \
		gs/samples/sampleCreate.js        \
		gs/samples/sampleSelect.js        \
		gs/samples/sampleDelete.js        \
		gs/samples/samplesForEach.js      \
		gs/samples/samplesCopyPaste.js    \
		gs/samples/samplesCut.js          \
		gs/samples/samplesDelete.js       \
		gs/samples/samplesDuration.js     \
		gs/samples/samplesWhen.js         \
		gs/samples/samplesSlip.js         \
		gs/samples/samplesCrop.js         \
		gs/samples/samplesUnselect.js     \
		                                  \
		gs/samples/Sample/constructor.js  \
		gs/samples/Sample/cut.js          \
		gs/samples/Sample/delete.js       \
		gs/samples/Sample/duration.js     \
		gs/samples/Sample/inTrack.js      \
		gs/samples/Sample/mute.js         \
		gs/samples/Sample/select.js       \
		gs/samples/Sample/slip.js         \
		gs/samples/Sample/when.js         \
		                                  \
		gs/events/bpm.js                  \
		gs/events/currentTime.js          \
		gs/events/clockUnits.js           \
		gs/events/divExtend.js            \
		gs/events/dropFiles.js            \
		gs/events/fileFilters.js          \
		gs/events/gridMouse.js            \
		gs/events/keyboard.js             \
		gs/events/panelMenu.js            \
		gs/events/playPauseStop.js        \
		gs/events/resize.js               \
		gs/events/save.js                 \
		gs/events/tools.js                \
		gs/events/toolCut.js              \
		gs/events/toolDelete.js           \
		gs/events/toolHand.js             \
		gs/events/toolMute.js             \
		gs/events/toolPaint.js            \
		gs/events/toolSelect.js           \
		gs/events/toolSlip.js             \
		gs/events/toolZoom.js             \
		                                  \
		init.js                           \
		                                  \
		-o compressed.js                  \
		--compress                        \
		--mangle
fi
