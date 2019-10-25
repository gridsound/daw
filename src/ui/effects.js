"use strict";

const UIeffects = new gsuiEffects();

function UIeffectsInit() {
	const win = UIwindows.window( "effects" );

	DOM.channelName.onclick = UIeffectsOnclickName;
	win.append( UIeffects.rootElement );
	win.onresize =
	win.onresizing = () => UIeffects.resized();
	UIeffects.attached();
	UIeffects.askData = ( fxId, fxType, dataType, ...args ) => {
		if ( fxType === "filter" && dataType === "curve" ) {
			const wafx = DAW.get.waeffect( fxId );

			return wafx && wafx.updateResponse( args[ 0 ] );
		}
	};
	UIeffects.oninput = DAW.liveChangeEffect.bind( DAW );
	UIeffects.onchange = DAW.changeEffects.bind( DAW );
}

function UIeffectsRenameChan( name ) {
	DOM.channelName.textContent = name;
}

function UIeffectsSelectChan( id ) {
	UIeffectsRenameChan( DAW.get.channel( id ).name );
	UIeffects.setDestFilter( id );
}

function UIeffectsOnclickName() {
	const id = UImixer.getCurrentChannelId();

	if ( id !== "main" ) {
		const prev = DOM.channelName.textContent;

		gsuiPopup
			.prompt( "Rename channel", "", prev, "Rename" )
			.then( name => {
				if ( name && name !== prev ) {
					DAW.compositionChange(
						{ channels: { [ id ]: { name } } },
						[ "mixer", "renameChan", name, prev ]
					);
				}
			} );
	}
}
