"use strict";

wa.keysToScheduleData = function( keys, when, offset, duration ) {
	return Object.keys( keys ).reduce( function( arr, key ) {
		key = keys[ key ];
		if ( offset < key.when + key.duration && key.when < offset + duration ) {
			arr.push( {
				key: key.key.toUpperCase(),
				whenBeat: when + key.when - offset,
				offsetBeat: key.offset,
				durationBeat: key.duration
			} );
		}
		return arr;
	}, [] );
};
