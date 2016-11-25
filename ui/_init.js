"use strict";

ui.init( wisdom.qS( "#app" ), "_app", {} );

ui.dom.toolBtns = wisdom.qSA( ui.dom.menu, ".btn[data-tool]" );
ui.tool = {};
ui.tracks = [];
ui.gridEm = parseFloat( getComputedStyle( ui.dom.grid ).fontSize );
ui.gridColsY = ui.dom.gridCols.getBoundingClientRect().top;
ui.dom.visualCanvas.width = 256;
ui.dom.visualCanvas.height = ui.dom.visualCanvas.clientHeight;
