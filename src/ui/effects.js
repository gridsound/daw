"use strict";

const UIeffects = new GSEffects();

function UIeffectsInit() {
	const win = UIwindows.window( "effects" );

	DOM.channelName.onclick = UIeffectsOnclickName;
	win.append( UIeffects.rootElement );
	win.onresize =
	win.onresizing = () => UIeffects.resized();
	UIeffects.setDAWCore( DAW );
	UIeffects.attached();
	UIeffects._uiEffects.askData = ( fxId, fxType, dataType, ...args ) => {
		if ( fxType === "filter" && dataType === "curve" ) {
			const wafx = DAW.get.audioEffect( fxId );

			return wafx && wafx.updateResponse( args[ 0 ] );
		}
	};
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
