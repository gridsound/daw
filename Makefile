#  _____     _   _ _____               _
# |   __|___|_|_| |   __|___ _ _ ___ _| |
# |  |  |  _| | . |__   | . | | |   | . |
# |_____|_| |_|___|_____|___|___|_|_|___|.com
#

MAKE          = make --no-print-directory
CSS_DIR       = css/
CSS_FILE      = style.css
SASS_FILE     = style.scss
TPL_DIR       = templates/
TPL_FILE      = __precompiled.js
JS_FILE       = compressed.js
WEBAUDIO_PATH = ../gs-webaudio-library/src/
GSUI          = gs-ui-components

all:
	@head -5 Makefile
	@$(MAKE) css
	@$(MAKE) html

html:
	@echo -n "* HTML ..... "
	@handlebars $(TPL_DIR) -f $(TPL_DIR)$(TPL_FILE)
	@echo $(TPL_FILE)
	@$(MAKE) js

js:
	@echo -n "* JS ....... "
	@uglifyjs $(JS_FILES) -o $(JS_FILE) --compress --mangle
	@echo $(JS_FILE)

css:
	@echo -n "* CSS ...... "
	@cd $(CSS_DIR); \
		tail -n +3 $(SASS_FILE) > ___tmp.scss; \
		sass ___tmp.scss $(CSS_FILE) --style compressed; \
		rm ___tmp.scss
	@echo $(CSS_FILE)

uicmp:
	@$(MAKE) -C ../$(GSUI)/
	@cp ../$(GSUI)/bin/$(GSUI).css ../$(GSUI)/bin/$(GSUI).js $(GSUI)
	@mv $(GSUI)/$(GSUI).css $(GSUI)/$(GSUI).scss

.PHONY: all html css js

JS_FILES = \
	featuresTest.js                     \
	                                    \
	jstools/keyboardRouter.min.js       \
	jstools/wisdom.js                   \
	jstools/handlebars.runtime.min.js   \
	gs-ui-components/gs-ui-components.js\
	$(TPL_DIR)$(TPL_FILE)               \
	$(WEBAUDIO_PATH)walcontext.js       \
	$(WEBAUDIO_PATH)composition.js      \
	$(WEBAUDIO_PATH)composition-loop.js \
	$(WEBAUDIO_PATH)buffer.js           \
	$(WEBAUDIO_PATH)waveform.js         \
	$(WEBAUDIO_PATH)filters.js          \
	$(WEBAUDIO_PATH)sample.js           \
	                                  \
	common/_init.js                   \
	common/timestampText.js           \
	common/uuid.js                    \
	                                  \
	gs/_init.js                       \
	gs/loop.js                        \
	gs/playPauseStop.js               \
	gs/file/click.js                  \
	gs/file/create.js                 \
	gs/file/delete.js                 \
	gs/file/joinFile.js               \
	gs/file/load.js                   \
	gs/file/play.js                   \
	gs/file/stop.js                   \
	gs/history/history.js             \
	gs/history/actions.js             \
	                                  \
	ui/ui.js                          \
	ui/bpm.js                         \
	ui/btnMagnet.js                   \
	ui/btnPlay.js                     \
	ui/btnStop.js                     \
	ui/btnUndo.js                     \
	ui/btnRedo.js                     \
	ui/clock.js                       \
	ui/currentTimeCursor.js           \
	ui/filesCursor.js                 \
	ui/filesInput.js                  \
	ui/historyList.js                 \
	ui/save.js                        \
	ui/timeline.js                    \
	ui/timelineBeats.js               \
	ui/timelineLoop.js                \
	ui/tracksBg.js                    \
	ui/visualCanvas.js                \
	ui/_init.js                       \
	                                  \
	ui/cursor.js                      \
	ui/getGridSec.js                  \
	ui/getTrackFromPageY.js           \
	ui/file.js                        \
	ui/newTrack.js                    \
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
	ui/Track/constructor.js           \
	ui/Track/editName.js              \
	ui/Track/toggle.js                \
	                                  \
	wa/_init.js                       \
	wa/oscilloscope.js                \
	                                  \
	gs/bpm.js                         \
	gs/currentTime.js                 \
	gs/reset.js                       \
	gs/file/dragstart.js              \
	                                  \
	gs/compositions/init.js           \
	gs/compositions/askName.js        \
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
	analyticstracking.js
