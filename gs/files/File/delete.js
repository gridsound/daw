"use strict";

gs.File.prototype.delete = function() {
	this.elFile.remove();
};
