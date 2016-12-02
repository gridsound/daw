#  _____     _   _ _____               _
# |   __|___|_|_| |   __|___ _ _ ___ _| |
# |  |  |  _| | . |__   | . | | |   | . |
# |_____|_| |_|___|_____|___|___|_|_|___|.com
#

CSS_DIR       = css/
SASS_FILE     = style.scss
CSS_FILE      = style.css
TPL_DIR       = templates/
TPL_FILE      = $(TPL_DIR)__precompiled.js
JS_FILE       = compressed.js
WEBAUDIO_PATH = ../webaudio-library/src/

all:
	@head -5 Makefile
	@make css
	@make html

html:
	@echo ":: HTML"
	@handlebars $(TPL_DIR) -f $(TPL_FILE)
	@make js

js:
	@echo ":: JS"
	@uglifyjs $(src) -o $(JS_FILE) --compress --mangle

css:
	@echo ":: CSS"
	@cd $(CSS_DIR); \
		tail -n +3 $(SASS_FILE) > ___tmp.scss; \
		sass ___tmp.scss $(CSS_FILE); \
		rm ___tmp.scss

clean:
	rm -f $(JS_FILE) $(CSS_DIR)$(CSS_FILE) $(TPL_FILE)

.PHONY: all html css js clean

src = \
	jstools/keyboardRouter.min.js       \
	jstools/wisdom.js                   \
	jstools/handlebars.runtime.min.js   \
	gs-ui-components/gs-ui-components.js\
	$(TPL_FILE)                         \
	$(WEBAUDIO_PATH)walcontext.js       \
	$(WEBAUDIO_PATH)composition.js      \
	$(WEBAUDIO_PATH)composition-loop.js \
	$(WEBAUDIO_PATH)buffer.js           \
	$(WEBAUDIO_PATH)waveform.js         \
	$(WEBAUDIO_PATH)filters.js          \
	$(WEBAUDIO_PATH)sample.js           \
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
	ui/timestampText.js               \
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
	ui/bpm.js                         \
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
	gs/load.js                        \
	gs/save.js                        \
	gs/readCompositionFile.js         \
	gs/reset.js                       \
	gs/file/dragstart.js              \
	                                  \
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
	gs/events/bpm.js                  \
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
