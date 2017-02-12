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
	@handlebars src/ui/html src/ui/html/partials -f bin/__templates.js
	@echo __templates.js
	@$(MAKE) js

js:
	@echo -n "* JS .................. "
	@uglifyjs $(JS) -o bin/gs-daw.min.js --compress --mangle
	@echo gs-daw.min.js

css:
	@echo -n "* CSS ................ "
	@cp src/dep/gs-ui-components.min.css src/dep/gs-ui-components.min.scss
	@cd bin/; sass -I ../src/ui/css ../src/ui/css/style.scss gs-daw.min.css --style compressed
	@rm src/dep/gs-ui-components.min.scss
	@echo gs-daw.min.css

wafwk:
	@$(MAKE) -C ../gs-webaudio-framework/
	@cp ../gs-webaudio-framework/bin/* src/dep

walib:
	@$(MAKE) -C ../gs-webaudio-library/
	@cp ../gs-webaudio-library/bin/* src/dep

uicmp:
	@$(MAKE) -C ../gs-ui-components/
	@cp ../gs-ui-components/bin/gs-* src/dep

.PHONY: all html css js wafwk walib uicmp

JS = \
	src/featuresTest.js                         \
	                                            \
	src/dep/keyboardRouter.min.js               \
	src/dep/handlebars.runtime.min.js           \
	src/dep/gs-ui-components.min.js             \
	src/dep/gs-webaudio-library.min.js          \
	src/dep/gs-webaudio-framework.min.js        \
	bin/__templates.js                          \
	                                            \
	src/common/_init.js                         \
	src/common/timestampText.js                 \
	src/common/uuid.js                          \
	                                            \
	src/ui/js/gs/_init.js                       \
	src/ui/js/gs/loop.js                        \
	src/ui/js/gs/playPauseStop.js               \
	src/ui/js/gs/file/create.js                 \
	src/ui/js/gs/file/delete.js                 \
	src/ui/js/gs/history/history.js             \
	src/ui/js/gs/history/actions.js             \
	                                            \
	src/ui/js/ui.js                             \
	src/ui/js/btnMagnet.js                      \
	src/ui/js/btnUndo.js                        \
	src/ui/js/btnRedo.js                        \
	src/ui/js/clock.js                          \
	src/ui/js/currentTimeCursor.js              \
	src/ui/js/exportToWaveFile.js               \
	src/ui/js/filesInput.js                     \
	src/ui/js/historyList.js                    \
	src/ui/js/save.js                           \
	src/ui/js/timeline.js                       \
	src/ui/js/timelineBeats.js                  \
	src/ui/js/timelineLoop.js                   \
	src/ui/js/tracksBg.js                       \
	src/ui/js/visual.js                         \
	src/ui/js/_init.js                          \
	                                            \
	src/init.js                                 \
	src/on/addSource.js                         \
	src/on/addTrack.js                          \
	src/on/endedSource.js                       \
	src/on/fillSource.js                        \
	src/on/loadingSource.js                     \
	src/on/loadSource.js                        \
	src/on/playPauseStop.js                     \
	src/on/playSource.js                        \
	src/on/removeSample.js                      \
	src/on/sampleCreate.js                      \
	src/on/sampleDuration.js                    \
	src/on/sampleInTrack.js                     \
	src/on/sampleWhen.js                        \
	src/on/setBPM.js                            \
	src/on/stopAllSources.js                    \
	                                            \
	src/ui/js/cursor.js                         \
	src/ui/js/getGridSec.js                     \
	src/ui/js/getTrackFromPageY.js              \
	src/ui/js/panelSection.js                   \
	src/ui/js/resize.js                         \
	src/ui/js/sample.js                         \
	src/ui/js/selectTool.js                     \
	src/ui/js/setFilesWidth.js                  \
	src/ui/js/setGridScrollTop.js               \
	src/ui/js/setGridZoom.js                    \
	src/ui/js/setTrackLinesLeft.js              \
	src/ui/js/setTrackNamesWidth.js             \
	src/ui/js/updateGridShadows.js              \
	                                            \
	src/ui/js/gs/currentTime.js                 \
	src/ui/js/gs/reset.js                       \
	                                            \
	src/ui/js/gs/compositions/init.js           \
	src/ui/js/gs/compositions/load.js           \
	src/ui/js/gs/compositions/readFile.js       \
	src/ui/js/gs/compositions/save.js           \
	src/ui/js/gs/compositions/serialize.js      \
	src/ui/js/gs/compositions/store.js          \
	src/ui/js/gs/sample/delete.js               \
	src/ui/js/gs/sample/duration.js             \
	src/ui/js/gs/sample/inTrack.js              \
	src/ui/js/gs/sample/mute.js                 \
	src/ui/js/gs/sample/select.js               \
	src/ui/js/gs/sample/slip.js                 \
	src/ui/js/gs/sample/when.js                 \
	src/ui/js/gs/samples/selected/do.js         \
	src/ui/js/gs/samples/selected/min.js        \
	src/ui/js/gs/samples/selected/max.js        \
	src/ui/js/gs/samples/selected/copyPaste.js  \
	src/ui/js/gs/samples/selected/cut.js        \
	src/ui/js/gs/samples/selected/delete.js     \
	src/ui/js/gs/samples/selected/duration.js   \
	src/ui/js/gs/samples/selected/when.js       \
	src/ui/js/gs/samples/selected/slip.js       \
	src/ui/js/gs/samples/selected/crop.js       \
	src/ui/js/gs/samples/selected/unselect.js   \
	                                            \
	src/ui/js/gs/events/bodyClick.js            \
	src/ui/js/gs/events/clockUnits.js           \
	src/ui/js/gs/events/divExtend.js            \
	src/ui/js/gs/events/dropFiles.js            \
	src/ui/js/gs/events/fileFilters.js          \
	src/ui/js/gs/events/gridMouse.js            \
	src/ui/js/gs/events/keyboard.js             \
	src/ui/js/gs/events/panelMenu.js            \
	src/ui/js/gs/events/resize.js               \
	src/ui/js/gs/events/tools.js                \
	src/ui/js/gs/events/toolCut.js              \
	src/ui/js/gs/events/toolDelete.js           \
	src/ui/js/gs/events/toolHand.js             \
	src/ui/js/gs/events/toolMute.js             \
	src/ui/js/gs/events/toolPaint.js            \
	src/ui/js/gs/events/toolSelect.js           \
	src/ui/js/gs/events/toolSlip.js             \
	src/ui/js/gs/events/toolZoom.js             \
	                                            \
	init.js                                     \
	src/run.js                                  \
	                                            \
	src/analyticstracking.js
