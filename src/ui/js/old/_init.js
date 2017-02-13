"use strict";

ui.init();
ui.BPMem = 1;
ui.dom.toolBtns = Array.from( ui.dom.menu.querySelectorAll( ".btn[data-tool]" ) );
ui.tool = {};
ui.gridEm = parseFloat( getComputedStyle( ui.dom.grid ).fontSize );
ui.gridColsY = ui.dom.gridCols.getBoundingClientRect().top;
ui.gsuiPopup = new gsuiPopup( document.querySelector( ".gsuiPopup" ) );
