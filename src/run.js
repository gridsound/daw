"use strict";

UIloading().then( UIrun ).then( UIloaded );

function UIrun() {
	const DAW = new DAWCore(),
		hash = new Map( location.hash
			.substr( 1 )
			.split( "&" )
			.map( kv => kv.split( "=" ) )
		);

	window.DAW = DAW;
	window.VERSION = "0.36.1";

	document.body.append(
		GSUI.createElement( "gsui-daw", {
			version: window.VERSION,
			volume: DAW.destination.getGain(),
			uirate: +localStorage.getItem( "uiRefreshRate" ) || "auto",
			samplerate: DAW.env.sampleRate,
			timelinenumbering: localStorage.getItem( "uiTimeNumbering" ) || "1",
			windowslowgraphics: !!+( localStorage.getItem( "gsuiWindows.lowGraphics" ) || "0" ),
		} ),
		GSUI.getTemplate( "window-main" ),
		GSUI.getTemplate( "window-piano" ),
		GSUI.getTemplate( "window-drums" ),
		GSUI.getTemplate( "window-synth" ),
		GSUI.getTemplate( "window-mixer" ),
		GSUI.getTemplate( "window-blocks" ),
		GSUI.getTemplate( "window-slicer" ),
		GSUI.getTemplate( "window-effects" ),
	);

	window.DOM = Array.prototype.reduce.call(
		document.querySelectorAll( "[id]" ), ( obj, el ) => {
			obj[ el.id ] = el;
			return obj;
		}, {} );

	window.UIdaw = document.querySelector( "gsui-daw" );
	window.UIwindows = GSUI.createElement( "gsui-windows" );
	UIdaw.querySelector( ".gsuiDAW-body" ).append( UIwindows );

	DAW.setLoopRate( +localStorage.getItem( "uiRefreshRate" ) || 60 );
	UIwindows.lowGraphics( !!+( localStorage.getItem( "gsuiWindows.lowGraphics" ) || "0" ) ); // should be static
	gsuiClock.numbering( localStorage.getItem( "uiTimeNumbering" ) || "1" );
	gsuiTimeline.numbering( localStorage.getItem( "uiTimeNumbering" ) || "1" );

	window.UIdrums = new GSDrums();
	window.UIeffects = new GSEffects();
	window.UImixer = new GSMixer();
	window.UIslicer = new GSSlicer();
	window.UIpatternroll = new GSPatternroll();
	window.UIpatterns = new GSPatterns();
	window.UIpianoroll = new GSPianoroll();
	window.UIsynth = new GSSynth();

	UIwindowsInit();
	UIdrumsInit();
	UImixerInit();
	UIsynthInit();
	UIslicerInit();
	UIeffectsInit();
	UIpatternsInit();
	UIpianorollInit();
	UIpatternrollInit();

	window.onblur = () => UIpianoroll.getUIKeys().midiReleaseAllKeys();
	window.onkeyup = UIkeyboardUp;
	window.onkeydown = UIkeyboardDown;
	window.onbeforeunload = UIcompositionBeforeUnload;
	document.body.ondrop = UIdrop;
	document.body.ondragover = () => false;
	document.body.oncontextmenu = () => location.host === 'localhost' ? undefined : false;

	document.addEventListener( "wheel", e => {
		if ( e.ctrlKey ) {
			e.preventDefault();
		}
	}, { passive: false } );
	document.addEventListener( "drop", e => {
		DAW.dropAudioFiles( e.dataTransfer.files );
	} );

	DAW.cb.focusOn = UIcontrolsFocusOn;
	DAW.cb.currentTime = ( beat, focused ) => {
		GSUI.setAttribute( UIcontrolsGetFocusedGrid( focused ), "currenttime", beat );
		GSUI.setAttribute( UIdaw, "currenttime", beat );
	};
	// DAW.cb.clockUpdate = beat => GSUI.setAttribute( UIdaw, "currenttime", beat );
	DAW.cb.buffersLoaded = UIpatternsBuffersLoaded;
	DAW.cb.compositionAdded = cmp => UIdaw.addComposition( cmp );
	DAW.cb.compositionOpened = cmp => {
		GSUI.setAttribute( UIdaw, "currentcomposition", `${ cmp.options.saveMode }:${ cmp.id }` );
		UIpatterns.rootElement.expandSynth( cmp.synthOpened, true );
		UIeffectsSelectChan( "main" );
		UItitle( cmp.name );
	};
	DAW.cb.compositionClosed = UIcompositionClosed;
	DAW.cb.compositionChanged = UIcompositionChanged;
	DAW.cb.compositionDeleted = cmp => UIdaw.deleteComposition( cmp );
	DAW.cb.compositionLoading = ( cmp, loading ) => GSUI.setAttribute( UIdaw, "saving", loading );
	DAW.cb.compositionSavedStatus = ( cmp, saved ) => {
		GSUI.setAttribute( UIdaw, "saved", saved );
		UItitle( cmp.name );
	};
	DAW.cb.compositionSavingPromise = UIauthSaveComposition;
	DAW.cb.historyUndo = () => UIdaw.undo();
	DAW.cb.historyRedo = () => UIdaw.redo();
	DAW.cb.historyAddAction = act => UIdaw.stackAction( act.icon, act.desc );
	DAW.cb.onstartdrum = rowId => UIdrums.onstartdrum( rowId );
	DAW.cb.onstopdrumrow = rowId => UIdrums.onstopdrumrow( rowId );
	DAW.cb.analyserFilled = data => UIdaw.updateSpectrum( data );
	DAW.cb.channelAnalyserFilled = UImixer.updateAudioData.bind( UImixer );
	DAW.cb.pause =
	DAW.cb.stop = () => GSUI.setAttribute( UIdaw, "playing", false );
	DAW.cb.play = () => GSUI.setAttribute( UIdaw, "playing", true );

	GSUI.setAttribute( UIdaw.clock, "mode", localStorage.getItem( "gsuiClock.display" ) || "second" );
	UIdaw.onSubmitLogin = ( email, pass ) => {
		GSUI.setAttribute( UIdaw, "logging", true );
		GSUI.setAttribute( UIdaw, "errauth", false );
		return gsapiClient.login( email, pass )
			.then( me => {
				UIauthLoginThen( me );
				return gsapiClient.getUserCompositions( me.id );
			} )
			.then( cmps => {
				const opt = { saveMode: "cloud" };

				cmps.forEach( cmp => DAW.addComposition( cmp.data, opt ) );
			} )
			.catch( res => {
				GSUI.setAttribute( UIdaw, "errauth", res.msg );
				throw res;
			} )
			.finally( () => GSUI.setAttribute( UIdaw, "logging", false ) );
	};
	UIdaw.onSubmitOpen = ( url, file ) => {
		if ( url || file[ 0 ] ) {
			return ( url
				? DAW.addCompositionByURL( url )
				: DAW.addCompositionByBlob( file[ 0 ] )
			).then( cmp => DAW.openComposition( "local", cmp.id ) );
		}
	};
	UIdaw.onExportJSON = ( saveMode, id ) => DAW.exportCompositionToJSON( saveMode, id );
	GSUI.listenEvents( UIdaw, {
		gsuiDAW: {
			"oki-cookies": () => {
				document.cookie = "cookieAccepted";
				GSUI.setAttribute( UIdaw, "oki-cookies", "" );
			},
			switchCompositionLocation: d => {
				const [ saveMode, id ] = d.args;

				( saveMode === "local"
					? UIcompositionCloudDrop
					: UIcompositionLocalDrop )( saveMode, id );
			},
			settings: d => {
				const data = d.args[ 0 ];

				DAW.setLoopRate( data.uiRate === "auto" ? 60 : data.uiRate );
				DAW.setSampleRate( data.sampleRate );
				UIwindows.lowGraphics( data.windowsLowGraphics );
				gsuiClock.numbering( data.timelineNumbering );
				gsuiTimeline.numbering( data.timelineNumbering );
				localStorage.setItem( "uiRefreshRate", data.uiRate );
				localStorage.setItem( "gsuiWindows.lowGraphics", +data.windowsLowGraphics );
				localStorage.setItem( "uiTimeNumbering", data.timelineNumbering );
				GSUI.setAttribute( UIdaw, "uirate", data.uiRate );
				GSUI.setAttribute( UIdaw, "samplerate", data.sampleRate );
				GSUI.setAttribute( UIdaw, "timelinenumbering", data.timelineNumbering );
				GSUI.setAttribute( UIdaw, "windowslowgraphics", data.windowsLowGraphics );
			},
			changeDisplayClock: d => {
				const display = d.args[ 0 ];

				localStorage.setItem( "gsuiClock.display", display );
			},
			export: () => {
				const dur = DAW.get.duration() * 60 / DAW.get.bpm(),
					intervalId = setInterval( () => {
						GSUI.setAttribute( UIdaw, "exporting", DAW.ctx.currentTime / dur );
					}, 100 );

				DAW.exportCompositionToWAV().then( obj => {
					clearInterval( intervalId );
					GSUI.setAttribute( UIdaw, "exporting", 1 );
					UIdaw.readyToDownload( obj.url, obj.name );
				} );
			},
			abortExport: () => DAW.abortWAVExport(),
			save: d => UIcompositionClickSave(),
			open: d => UIcompositionClickOpen( ...d.args ),
			delete: d => UIcompositionClickDelete( ...d.args ),
			tempo: d => {
				const o = d.args[ 0 ];

				DAW.callAction( "changeTempo", o.bpm, o.beatsPerMeasure, o.stepsPerBeat );
			},
			logout: () => {
				GSUI.setAttribute( UIdaw, "logging", true );
				gsapiClient.logout()
					.finally( () => GSUI.setAttribute( UIdaw, "logging", false ) )
					.then( () => {
						GSUI.setAttribute( UIdaw, "logged", false );
						GSUI.setAttribute( UIdaw, "useravatar", false );
						GSUI.setAttribute( UIdaw, "username", false );
						DAW.get.compositions( "cloud" )
							.forEach( cmp => DAW.deleteComposition( "cloud", cmp.id ) );
						if ( !DAW.get.cmp() ) {
							UIcompositionClickNewLocal();
						}
					} );
			},
			localNewCmp: () => UIcompositionClickNewLocal(),
			cloudNewCmp: () => UIcompositionClickNewCloud(),
			openWindow: d => UIwindows.window( d.args[ 0 ] ).open(),
			closeWindow: d => UIwindows.window( d.args[ 0 ] ).close(),
			focusSwitch: () => DAW.focusSwitch(),
			volume: d => DAW.destination.setGain( d.args[ 0 ] ),
			rename: d => DAW.callAction( "renameComposition", d.args[ 0 ] ),
			currentTimeLive: d => UIcontrolsGetFocusedGrid().timeline.previewCurrentTime( d.args[ 0 ] ),
			currentTime: d => {
				UIcontrolsGetFocusedGrid().timeline.previewCurrentTime( false );
				DAW.getFocusedObject().setCurrentTime( d.args[ 0 ] );
			},
			play: () => DAW.togglePlay(),
			stop: () => {
				DAW.stop();
				switch ( document.activeElement ) {
					case UIpianoroll.rootElement: DAW.focusOn( "keys", "-f" ); break;
					case UIdrums.rootElement: DAW.focusOn( "drums", "-f" ); break;
					case UIslicer.rootElement: DAW.focusOn( "slices", "-f" ); break;
					case UIpatternroll.rootElement: DAW.focusOn( "composition", "-f" ); break;
				}
			},
			reset: () => DAW.resetAudioContext(),
			undo: () => DAW.history.undo(),
			redo: () => DAW.history.redo(),
			redoN: d => {
				let n = d.args[ 0 ];

				if ( n < 0 ) {
					while ( n++ < 0 ) {
						DAW.history.undo();
					}
				} else {
					while ( n-- > 0 ) {
						DAW.history.redo();
					}
				}
			},
		},
	} );

	if ( document.cookie.indexOf( "cookieAccepted" ) > -1 ) {
		GSUI.setAttribute( UIdaw, "oki-cookies", "" );
	}

	UIwindows.window( "blocks" ).open();
	UIwindows.window( "main" ).open();
	UIwindows.window( "mixer" ).open();

	UIauthGetMe();
	DAW.addCompositionsFromLocalStorage();

	document.addEventListener( "gsuiEvents", e => {
		const { component, eventName, args } = e.detail;

		console.warn( `uncatched gsuiEvent: [${ component }][${ eventName }]`, args );
	} );

	if ( !hash.has( "cmp" ) ) {
		UIcompositionClickNewLocal();
	} else {
		DAW.addCompositionByURL( hash.get( "cmp" ) )
			.catch( e => {
				console.error( e );
				return DAW.addNewComposition();
			} )
			.then( cmp => DAW.openComposition( "local", cmp.id ) );
		location.hash = "";
	}
}
