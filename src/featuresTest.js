"use strict";

if ( !window.AudioContext ) {
	document.body.innerHTML =
		"<div id='nowebaudio'>" +
			"Sorry, <i><b>GridSound</b></i> is not compatible with this browser ¯\\_(ツ)_/¯<br/>" +
  			"Maybe you should use&nbsp;: " +
  				"<i class='icon chrome'></i> <i>Chrome</i> or " +
  				"<i class='icon firefox'></i> <i>Firefox</i> or " +
  				"<i class='icon safari'></i> <i>Safari</i>." +
		"</div>";
}
