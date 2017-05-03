"use strict";

ui.init();
ui.gridEm = parseFloat( getComputedStyle( ui.dom.grid ).fontSize );
ui.gridColsY = ui.dom.gridCols.getBoundingClientRect().top;
