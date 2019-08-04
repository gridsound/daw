"use strict";

const UImixer = new gsuiMixer();

function UImixerInit() {
	const win = UIwindows.window( "mixer" );

	UImixer.onaddChan = UImixerAddChan;
	UImixer.ondeleteChan = UImixerDeleteChan;
	UImixer.onupdateChan = UImixerUpdateChan;
	UImixer.onselectChan = UImixerSelectChan;
	UImixer.oninput = DAW.liveChangeChannel.bind( DAW );
	UImixer.onchange = DAW.changeChannels.bind( DAW );
	win.onresize =
	win.onresizing = () => UImixer.resized();
	win.append( UImixer.rootElement );
	UImixer.attached();
}

function UImixerAddChan( id, obj ) {
	const opt = document.createElement( "option" );

	opt.value = id;
	opt.textContent = obj.name;
	DOM.selectChanPopupSelect.append( opt );
}

function UImixerDeleteChan( id ) {
	DOM.selectChanPopupSelect.querySelector( `option[value="${ id }"]` ).remove();
}

function UImixerUpdateChan( id, prop, val ) {
	if ( prop === "name" ) {
		DOM.selectChanPopupSelect.querySelector( `option[value="${ id }"]` ).textContent = val;
	}
}

function UImixerSelectChan( id ) {
	UIwindows.window( "mixer" ).open();
	UIwindows.window( "mixer" ).focus();
	UIeffectsSelectChan( id );
}

function UImixerOpenChanPopup( objFamily, objId ) {
	const currChanId = DAW.get[ objFamily ]()[ objId ].dest;

	DOM.selectChanPopupSelect.value = currChanId;
	gsuiPopup.custom( {
		title: "Channels",
		element: DOM.selectChanPopupContent,
		submit( data ) {
			const dest = data.channel;

			if ( dest !== currChanId ) {
				DAW.compositionChange( {
					[ objFamily ]: {
						[ objId ]: { dest }
					}
				} );
				UImixer.selectChan( dest );
			}
		}
	} );
}
