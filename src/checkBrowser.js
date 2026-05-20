"use strict";

if (
	!window.AudioContext ||
	!window.customElements ||
	!window.CSS.supports( "color:rgb(from #fff r g b / 1)" )
) {
	window.top.location = "https://gridsound.com/unsupported-browsers";
}
