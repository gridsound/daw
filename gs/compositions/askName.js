"use strict";

gs.compositions.askName = function() {
	var name = prompt( "Please enter a name for your new composition :" );

	return name && name.trim();
};
