"use strict";

function UIwindowsInit() {
	window.UIwindows = document.querySelector( "gsui-windows" );
	UIwindows.lowGraphics( true );
	UIwindowsAppendContent( UIwindows );
	UIwindows.onopen = win => UIwindowsBtn( win.dataset.id, true );
	UIwindows.onclose = win => {
		UIwindowsBtn( win.dataset.id, false );
		switch ( win.dataset.id ) {
			case "piano": DAW.callAction( "closePattern", "keys" ); break;
			case "drums": DAW.callAction( "closePattern", "drums" ); break;
		}
	};
	DOM.winBtns.onclick = e => {
		const btn = e.target;

		if ( btn.dataset.win ) {
			UIwindows.window( btn.dataset.win ).openToggle(
				!btn.classList.contains( "winBtn-open" ) );
		}
	};
	UIwindowsSetPos( "blocks",   20,  20, 180, 380, 320, 780, "folder-tree", "blocks" );
	UIwindowsSetPos( "mixer",   360,  20, 266, 200, 400, 300, "mixer",       "mixer" );
	UIwindowsSetPos( "main",    780,  20, 380, 180, 600, 360, "music",       "composition" );
	UIwindowsSetPos( "synth",   360, 340, 340, 220, 400, 460, "oscillator",  "synth" );
	UIwindowsSetPos( "piano",   780, 400, 380, 180, 600, 400, "keys",        "pianoroll" );
	UIwindowsSetPos( "drums",   410, 450, 380, 180, 900, 400, "drums",       "drums" );
	UIwindowsSetPos( "effects", 480, 120, 230, 180, 420, 360, "effects",     "effects" );
}

function UIwindowsSetPos( winId, x, y, wmin, hmin, w, h, icon, title ) {
	const win = UIwindows.window( winId );

	win.setSize( w, h );
	win.setMinSize( wmin, hmin );
	win.setTitle( title );
	win.setPosition( x, y );
	win.setTitleIcon( icon );
}

function UIwindowsBtn( winId, b ) {
	DOM.winBtnsMap.get( winId ).classList.toggle( "winBtn-open", b );
}

function UIwindowsAppendContent( UIwindows ) {
	document.querySelectorAll( "div[data-window]" ).forEach( winCnt => {
		const win = UIwindows.createWindow( winCnt.dataset.window ),
			elWinCnt = win.querySelector( ".gsuiWindow-content" ),
			children = Array.from( winCnt.children );

		winCnt.remove();
		winCnt.classList.forEach( c => elWinCnt.classList.add( c ) );
		if ( children.length ) {
			const child0 = children[ 0 ];

			if ( child0.classList.contains( "windowMenu" ) ) {
				children.shift();
				win.headAppend( ...child0.children );
			}
			win.contentAppend( ...children );
		}
	} );
}
