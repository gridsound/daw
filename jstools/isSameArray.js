function isSameArray( arr1, arr2 ) {
	var i;
	if ( !arr1 || !arr2 ||
		arr1.length != arr2.length ) {
		return false;
	}
	for ( i = arr1.length - 1; i >= 0; i-- ) {
		if ( arr1[ i ] !== arr2[ i ] ) {
			return false;
		}
	}
	return true;
}