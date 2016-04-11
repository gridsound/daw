// This is a temporary debug file.

/** /
ui.newFile( { name: "Drum_p54" } );
ui.newFile( { name: "Drum_p54a" } );
ui.newFile( { name: "Drum_p54b" } );
ui.newFile( { name: "Drum_p55" } );
ui.newFile( { name: "Kick" } );
ui.newFile( { name: "Snare_02" } );
ui.files[ 0 ].jqFile.click();
ui.files[ 1 ].jqFile.click();
/**/

for ( var i = 0; i < 43; ++i ) {
	ui.newTrack();
}
ui.tracks[ 1 ].editName( "This" );
ui.tracks[ 2 ].toggle( false ).editName( "project" );
ui.tracks[ 3 ].toggle( false ).editName( "is in an" );
ui.tracks[ 4 ].toggle( false ).editName( "active rush!" );
ui.tracks[ 7 ].editName( "github.com/GridSound/gridsound.github.io" );
ui.tracks[ 9 ].toggle( false );
ui.jqTrackLines.children().eq(0).append("<div class='audionode' style='left:1em'>")
ui.jqTrackLines.children().eq(1).append("<div class='audionode' style='left:0em'>")
ui.jqTrackLines.children().eq(2).append("<div class='audionode' style='left:10em'>")
ui.jqTrackLines.children().eq(3).append("<div class='audionode' style='left:0em'>")
ui.jqTrackLines.children().eq(4).append("<div class='audionode' style='left:7em'>")
ui.jqTrackLines.children().eq(5).append("<div class='audionode' style='left:8em'>")
ui.jqTrackLines.children().eq(6).append("<div class='audionode' style='left:9em'>")
ui.jqTrackLines.children().eq(7).append("<div class='audionode' style='left:7em'>")
