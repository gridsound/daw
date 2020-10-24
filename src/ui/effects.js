"use strict";

function UIeffectsInit() {
	const win = UIwindows.window( "effects" );

	DOM.channelName.onclick = UIeffectsOnclickName;
	win.append( UIeffects.rootElement );
	UIeffects.setDAWCore( DAW );
}

function UIeffectsRenameChan( name ) {
	DOM.channelName.textContent = name;
}

function UIeffectsSelectChan( id ) {
	UIeffectsRenameChan( DAW.get.channel( id ).name );
	UIeffects.setDestFilter( id );
}

function UIeffectsOnclickName() {
	const id = UImixer.getSelectedChannelId();

	if ( id !== "main" ) {
		gsuiPopup
			.prompt( "Rename channel", "", DOM.channelName.textContent, "Rename" )
			.then( name => DAW.callAction( "renameChannel", id, name ) );
	}
}
