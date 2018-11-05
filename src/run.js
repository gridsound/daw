"use strict";

( function() {

const DAW = new DAWCore(),
	hash = new Map( location.hash
		.substr( 1 )
		.split( "&" )
		.map( kv => kv.split( "=" ) )
	);

gswaPeriodicWaves.forEach( ( w, name ) => (
	gsuiPeriodicWave.addWave( name, w.real, w.imag )
) );

window.DAW = DAW;
window.VERSION = "0.18.0";

UIdomInit();
UIsynthInit();
UIsynthsInit();
UIcookieInit();
UIhistoryInit();
UIpatternsInit();
UIcontrolsInit();
UIpianorollInit();
UIaboutPopupInit();
UIpatternrollInit();
UIrenderPopupInit();
UIcompositionsInit();
UIsettingsPopupInit();
UImasterAnalyserInit();
UIshortcutsPopupInit();
DAW.initPianoroll();

window.onkeyup = UIkeyboardUp;
window.onkeydown = UIkeyboardDown;
window.onbeforeunload = UIcompositionBeforeUnload;
document.body.ondrop = UIdrop;
document.body.ondragover = () => false;

DAW.cb.focusOn = UIcontrolsFocusOn;
DAW.cb.currentTime = UIcontrolsCurrentTime;
DAW.cb.clockUpdate = UIcontrolsClockUpdate;
DAW.cb.compositionOpened = UIcompositionOpened;
DAW.cb.compositionClosed = UIcompositionClosed;
DAW.cb.compositionChanged = UIcompositionChanged;
DAW.cb.compositionDeleted = UIcompositionDeleted;
DAW.cb.compositionAdded = UIcompositionAdded;
DAW.cb.compositionSaved = UIcompositionSaved;
DAW.cb.analyserFilled = data => UImasterAnalyser.draw( data );
DAW.cb.pause =
DAW.cb.stop = () => { DOM.play.classList.remove( "ico-pause" ); };
DAW.cb.play = () => { DOM.play.classList.add( "ico-pause" ); };

window.onresize();

DAW.addCompositionsFromLocalStorage();

if ( !hash.has( "cmp" ) ) {
	UIcompositionClickNew();
} else {
	DAW.addCompositionByURL( hash.get( "cmp" ) )
		.catch( e => {
			console.error( e );
			return DAW.addNewComposition();
		} )
		.then( cmp => DAW.openComposition( cmp.id ) );
	location.hash = "";
}

} )();
