#  _____     _   _ _____               _
# |   __|___|_|_| |   __|___ _ _ ___ _| |
# |  |  |  _| | . |__   | . | | |   | . |
# |_____|_| |_|___|_____|___|___|_|_|___|.com
#

MAKE = make --no-print-directory

all:
	@head -5 Makefile
	@$(MAKE) css
	@$(MAKE) html

html:
	@echo -n "* HTML ............... "
	@handlebars templates -f templates/__templates.js
	@echo __templates.js
	@$(MAKE) js

js:
	@echo -n "* JS .................. "
	@uglifyjs $(JS) -o bin/gs-daw.min.js --compress --mangle
	@echo gs-daw.min.js

css:
	@echo -n "* CSS ................ "
	@cp dep/gs-ui-components.min.css dep/gs-ui-components.min.scss
	@sass -I css css/style.scss bin/gs-daw.min.css --style compressed
	@rm dep/gs-ui-components.min.scss
	@echo gs-daw.min.css

wafwk:
	@$(MAKE) -C ../gs-webaudio-framework/
	@cp ../gs-webaudio-framework/bin/* dep

walib:
	@$(MAKE) -C ../gs-webaudio-library/
	@cp ../gs-webaudio-library/bin/* dep

uicmp:
	@$(MAKE) -C ../gs-ui-components/
	@cp ../gs-ui-components/bin/gs-* dep

.PHONY: all html css js wafwk walib uicmp

JS = \
	featuresTest.js                   \
	                                  \
	dep/keyboardRouter.min.js         \
	dep/handlebars.runtime.min.js     \
	dep/gs-ui-components.min.js       \
	dep/gs-webaudio-library.min.js    \
	dep/gs-webaudio-framework.min.js  \
	templates/__templates.js          \
	                                  \
	common/_init.js                   \
	common/timestampText.js           \
	common/uuid.js                    \
	                                  \
	gs/_init.js                       \
	gs/loop.js                        \
	gs/playPauseStop.js               \
	gs/file/create.js                 \
	gs/file/delete.js                 \
	gs/file/joinFile.js               \
	gs/history/history.js             \
	gs/history/actions.js             \
	                                  \
	ui/ui.js                          \
	ui/btnMagnet.js                   \
	ui/btnUndo.js                     \
	ui/btnRedo.js                     \
	ui/clock.js                       \
	ui/currentTimeCursor.js           \
	ui/exportToWaveFile.js            \
	ui/filesInput.js                  \
	ui/historyList.js                 \
	ui/save.js                        \
	ui/timeline.js                    \
	ui/timelineBeats.js               \
	ui/timelineLoop.js                \
	ui/tracksBg.js                    \
	ui/visual.js                      \
	ui/_init.js                       \
	                                  \
	src/init.js                       \
	src/on/addSource.js               \
	src/on/addTrack.js                \
	src/on/endedSource.js             \
	src/on/loadingSource.js           \
	src/on/loadSource.js              \
	src/on/playPauseStop.js           \
	src/on/playSource.js              \
	src/on/setBPM.js                  \
	src/on/stopAllSources.js          \
	                                  \
	ui/cursor.js                      \
	ui/getGridSec.js                  \
	ui/getTrackFromPageY.js           \
	ui/panelSection.js                \
	ui/resize.js                      \
	ui/sample.js                      \
	ui/selectTool.js                  \
	ui/setFilesWidth.js               \
	ui/setGridScrollTop.js            \
	ui/setGridZoom.js                 \
	ui/setTrackLinesLeft.js           \
	ui/setTrackNamesWidth.js          \
	ui/updateGridShadows.js           \
	                                  \
	gs/currentTime.js                 \
	gs/reset.js                       \
	                                  \
	gs/compositions/init.js           \
	gs/compositions/load.js           \
	gs/compositions/readFile.js       \
	gs/compositions/save.js           \
	gs/compositions/serialize.js      \
	gs/compositions/store.js          \
	gs/sample/create.js               \
	gs/sample/delete.js               \
	gs/sample/duration.js             \
	gs/sample/inTrack.js              \
	gs/sample/mute.js                 \
	gs/sample/select.js               \
	gs/sample/slip.js                 \
	gs/sample/when.js                 \
	gs/samples/selected/do.js         \
	gs/samples/selected/min.js        \
	gs/samples/selected/max.js        \
	gs/samples/selected/copyPaste.js  \
	gs/samples/selected/cut.js        \
	gs/samples/selected/delete.js     \
	gs/samples/selected/duration.js   \
	gs/samples/selected/when.js       \
	gs/samples/selected/slip.js       \
	gs/samples/selected/crop.js       \
	gs/samples/selected/unselect.js   \
	                                  \
	gs/events/bodyClick.js            \
	gs/events/clockUnits.js           \
	gs/events/divExtend.js            \
	gs/events/dropFiles.js            \
	gs/events/fileFilters.js          \
	gs/events/gridMouse.js            \
	gs/events/keyboard.js             \
	gs/events/panelMenu.js            \
	gs/events/resize.js               \
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
	src/run.js                        \
	                                  \
	analyticstracking.js
