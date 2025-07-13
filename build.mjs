import fs from "node:fs";
import { exec } from "child_process";
import info from "./build-conf.mjs";

const headerLines = [
	`<!DOCTYPE html>`,
	`<html lang="en">`,
	`<head>`,
	`<title>${ info.title }</title>`,
	`<meta charset="utf-8"/>`,
	`<meta name="viewport" content="width=device-width, user-scalable=no"/>`,
	`<meta name="description" content="${ info.desc }"/>`,
	`<meta name="google" content="notranslate"/>`,
	`<meta name="theme-color" content="#3a5158"/>`,
	`<meta property="og:type" content="website"/>`,
	info.title    && `<meta property="og:title" content="${ info.title }"/>`,
	info.url      && `<meta property="og:url" content="${ info.url }"/>`,
	info.ogImage  && `<meta property="og:image" content="${ info.ogImage }"/>`,
	info.ogImageW && `<meta property="og:image:width" content="${ info.ogImageW }"/>`,
	info.ogImageH && `<meta property="og:image:height" content="${ info.ogImageH }"/>`,
	info.desc     && `<meta property="og:description" content="${ info.desc }"/>`,
	info.manifest && `<link rel="manifest" href="${ info.manifest }"/>`,
	info.favicon  && `<link rel="shortcut icon" href="${ info.favicon }"/>`,
];

const bodyLines = [
	`</head>`,
	`<body>`,
	`<noscript>It needs JavaScript to run</noscript>`,
];

const endLines = [
	`</body>`,
	`</html>`,
];

async function writeDevFile( prefix = "" ) {
	return [
		formatLines( headerLines ) + "\n",
		formatSep, ...info.cssSrcA.map( s => formatStyle( s ) ),
		formatSep, ...info.cssDep.map( s => formatStyle( `${ prefix }${ s }` ) ),
		formatSep, formatLines( bodyLines ) + "\n",
		formatSep, info.splashScreen && await readFile( info.splashScreen ),
		formatSep, `<script>function lg(a){return console.log.apply(console,arguments),a}</script>\n`,
		formatSep, ...info.jsSrcA.map( s => formatScript( s ) ),
		formatSep, ...info.jsDep.map( s => formatScript( `${ prefix }${ s }` ) ),
		formatSep, ...info.jsSrcB.map( s => formatScript( s ) ),
		formatLines( endLines ),
	].filter( Boolean ).join( "" );
}

async function writeProFile() {
	const cssSrcA = await readFiles( info.cssSrcA );
	const cssDep = await readFiles( info.cssDep );
	const jsSrcA = await readFiles( info.jsSrcA );
	const jsSrcB = await readFiles( info.jsSrcB );
	const jsDep = await readFiles( info.jsDep );

	fs.writeFileSync( "allCSS.css", cssSrcA + cssDep );
	fs.writeFileSync( "allJS.js", jsSrcA + jsDep + jsSrcB );

	const cssMin = await execCSSO( "allCSS.css" );
	const jsMin = await execTerser( "allJS.js" );

	fs.unlinkSync( "allCSS.css" );
	fs.unlinkSync( "allJS.js" );
	return [
		formatLines( headerLines ),
		`<style>\n${ cssMin }</style>\n`,
		formatLines( bodyLines ),
		info.splashScreen && await readFile( info.splashScreen ),
		`<script>function lg(a){return a}</script>\n`,
		`<script>GSUregisterServiceWorker("${ info.serviceWorker }")</script>\n`,
		`<script>\n${ jsMin }</script>\n`,
		formatLines( endLines ),
	].filter( Boolean ).join( "" );
}

// .............................................................................
const formatLines = lines => lines.filter( Boolean ).join( "\n" );
const formatScript = s => `<script src="${ s }"></script>\n`;
const formatStyle = s => `<link rel="stylesheet" href="${ s }"/>\n`;
const formatSep = `<!-- ${ ( new Array( 71 ) ).join( "." ) } -->\n`;

// .............................................................................
function lg( s ) {
	process.stdout.write( s );
}
function pathProd( path, prod ) {
	return prod ? path.replace( ".dev.js", ".prod.js" ) : path;
}
function readFiles( paths, prod = true ) {
	const prom = [];

	paths.forEach( p => prom.push( readFile( p, prod ) ) );
	return Promise.all( prom ).then( arr => arr.join( "\n" ) + "\n" );
}
function readFile( path, prod = true ) {
	return new Promise( res => {
		fs.readFile( pathProd( path, prod ), "utf8", ( err, txt ) => res( txt ) );
	} );
}

// .............................................................................
function execCmd( c ) {
	return new Promise( res => exec( c, ( err, stdout ) => res( stdout ) ) );
}
function execCSSO( path ) {
	return execCmd( `csso ${ path }` );
}
function execTerser( path ) {
	return execCmd( `terser ${ path } --compress --mangle --toplevel --mangle-props "regex='^[$]'"` );
}

// .............................................................................
switch ( process.argv[ 2 ] ) {
	default:
		lg( [
			"          ---------------------------------",
			"        .:: GridSound's build node-script ::.",
			"        -------------------------------------\n",
			"node build.mjs dev -------> create 'index.html' for dev (../Submodules/files)",
			"node build.mjs dev-main --> create 'index.html' for dev (./Submodules/files)",
			"node build.mjs prod ------> create 'index-prod.html' for production",
			"node build.mjs dep -------> update all submodules",
		].join( "\n" ) );
		break;
	case "prod":
		lg( "writing 'index-prod.html'... " );
		fs.writeFileSync( "index-prod.html", await writeProFile() );
		lg( "done" );
		break;
	case "dev-main":
		lg( "writing 'index.html'... " );
		fs.writeFileSync( "index.html", await writeDevFile() );
		lg( "done" );
		break;
	case "dev":
		lg( "writing 'index.html'... " );
		fs.writeFileSync( "index.html", await writeDevFile( "../" ) );
		lg( "done" );
		break;
	case "dep":
		lg( "updating git submodules... " );
		await execCmd( "git submodule init" );
		await execCmd( "git submodule update --remote" );
		await execCmd( "cp gs-wa-components/gswaCrossfade/gswaCrossfadeProc.js ." );
		lg( "done" );
		break;
}

// lint() {
// 	stylelint "${CSSfiles[@]}"
// 	echo '"use strict";' > __lintMain.js
// 	cat "${JSfilesProd[@]}" | grep -v '"use strict";' >> __lintMain.js
// 	cat "${JSfiles[@]}" | grep -v '"use strict";' >> __lintMain.js
// 	eslint __lintMain.js && rm __lintMain.js
// }
