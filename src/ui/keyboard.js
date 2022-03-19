"use strict";

const UIkeyboardFns = [
	[ true,  false, "o", () => UIdaw.showOpenPopup() ],
	[ true,  false, "s", () => UIcompositionClickSave() ],
	[ true,  true,  "n", () => UIcompositionClickNewLocal() ],
	[ true,  false, "z", () => DAW.history.undo() ],
	[ true,  false, "Z", () => DAW.history.redo() ],
	[ false, false, " ", () => DAW.isPlaying() ? DAW.stop() : DAW.play() ],
];

function UIkeyboardUp( e ) {
	UIpianorollKeyboardEvent( false, e );
}

function UIkeyboardDown( e ) {
	if ( !UIkeyboardShortcuts( e ) && !e.ctrlKey && !e.altKey && !e.shiftKey ) {
		UIpianorollKeyboardEvent( true, e );
	}
}

function UIkeyboardShortcuts( e ) {
	return UIkeyboardFns.some( ( [ ctrlOrAlt, alt, key, fn ] ) => {
		if ( ( key === e.key ) &&
			( !alt || e.altKey ) &&
			( ctrlOrAlt === ( e.ctrlKey || e.altKey ) )
		) {
			fn();
			e.preventDefault();
			return true;
		}
	} );
}
