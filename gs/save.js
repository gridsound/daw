"use strict"

gs.save = function()
{
	var
		_save = {
			bpm: this._bpm,
			files: []
		}
	;

	ui.files.forEach( function( f ) {
		_save.files.push( [
			f.id,
			f.file.name,
			f.file.size,
			f.file.type
		]);
	});

	return {
		href: "data:text/plain;charset=utf-8," + encodeURIComponent( JSON.stringify(_save) ),
		download: "s.txt"
	};
}

gs.load = function( file ) {
	var
		that = this,
		reader = new FileReader()
	;
	reader.onload = function( event ) {
		that._save = JSON.parse( event.target.result );
		that.bpm( that._save.bpm );
		that._save.files.forEach( function( f ) {
			ui.newFile( f );
		});
	};
	reader.readAsText( file );
}
