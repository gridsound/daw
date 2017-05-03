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
	@handlebars               \
		src/ui/html           \
		src/ui/html/partials  \
		src/ui/html/templates \
		-f bin/__templates.js
	@echo __templates.js
	@$(MAKE) js

js:
	@echo -n "* JS .................. "
	@uglifyjs $(JS) -o bin/gs-daw.min.js --compress --mangle
	@echo gs-daw.min.js

css:
	@echo -n "* CSS ................ "
	@cp src/dep/gs-ui-components.min.css src/dep/gs-ui-components.min.scss
	@cd bin; sass -I ../src/ui/css ../src/ui/css/_main.scss gs-daw.min.css --style compressed
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
	@cp ../gs-ui-components/bin/* src/dep
	@TMP=`grep \<\!\-\-\ gs-ui-components -n index.html | cut -d':' -f1` ;\
	head index.html -n $$TMP > _html ;\
	cat src/dep/gs-ui-components.min.html >> _html ;\
	tail -n +$$((TMP+2)) index.html >> _html ;\
	rm index.html ;\
	mv _html index.html ;\

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
	src/init.js                                 \
	src/common/cursor.js                        \
	src/common/secCeilFloorRound.js             \
	src/common/timestampText.js                 \
	src/common/uuid.js                          \
	src/ui/js/app.js                            \
	src/ui/js/partials/bpm.js                   \
	src/ui/js/partials/clock.js                 \
	src/ui/js/partials/controls.js              \
	src/ui/js/partials/grid.js                  \
	src/ui/js/partials/gridcontent.js           \
	src/ui/js/partials/history.js               \
	src/ui/js/partials/timeline.js              \
	src/ui/js/partials/toolDelete.js            \
	src/ui/js/partials/tools.js                 \
	src/ui/js/partials/toolSelect.js            \
	src/ui/js/partials/tracksBg.js              \
	src/ui/js/partials/visual.js                \
	src/ui/js/templates/itemBuffer.js           \
	src/ui/js/templates/historyAction.js        \
	src/ui/js/templates/gridblockSample.js      \
	src/ui/js/templates/track.js                \
	                                            \
	src/ui/js/old/gs/loop.js                        \
	src/ui/js/old/gs/playPauseStop.js               \
	src/ui/js/old/gs/reset.js                       \
	                                                \
	src/ui/js/old/ui.js                             \
	src/ui/js/old/btnMagnet.js                      \
	src/ui/js/old/exportToWaveFile.js               \
	src/ui/js/old/filesInput.js                     \
	src/ui/js/old/save.js                           \
	src/ui/js/old/timelineBeats.js                  \
	src/ui/js/old/timelineLoop.js                   \
	src/ui/js/old/_init.js                          \
	                                                \
	src/ui/js/old/panelSection.js                   \
	src/ui/js/old/resize.js                         \
	src/ui/js/old/sample.js                         \
	src/ui/js/old/setFilesWidth.js                  \
	src/ui/js/old/setTrackNamesWidth.js             \
	                                                \
	src/ui/js/old/gs/compositions/init.js           \
	src/ui/js/old/gs/compositions/load.js           \
	src/ui/js/old/gs/compositions/readFile.js       \
	src/ui/js/old/gs/compositions/save.js           \
	src/ui/js/old/gs/compositions/serialize.js      \
	src/ui/js/old/gs/compositions/store.js          \
	src/ui/js/old/gs/samples/selected/copyPaste.js  \
	src/ui/js/old/gs/samples/selected/cut.js        \
	src/ui/js/old/gs/samples/selected/crop.js       \
	                                                \
	src/ui/js/old/gs/events/bodyClick.js            \
	src/ui/js/old/gs/events/divExtend.js            \
	src/ui/js/old/gs/events/dropFiles.js            \
	src/ui/js/old/gs/events/fileFilters.js          \
	src/ui/js/old/gs/events/gridMouse.js            \
	src/ui/js/old/gs/events/panelMenu.js            \
	src/ui/js/old/gs/events/resize.js               \
	src/ui/js/old/gs/events/toolCut.js              \
	src/ui/js/old/gs/events/toolHand.js             \
	src/ui/js/old/gs/events/toolMute.js             \
	src/ui/js/old/gs/events/toolPaint.js            \
	src/ui/js/old/gs/events/toolSlip.js             \
	src/ui/js/old/gs/events/toolZoom.js             \
	                                                \
	src/databinding.js                              \
	src/keybinding.js                               \
	src/run.js                                      \
	src/analyticstracking.js
