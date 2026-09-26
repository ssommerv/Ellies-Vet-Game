// Wraps game.html (the page body) into index.html, a full page that can be
// added to the iPad home screen and hosted anywhere (for example GitHub Pages).
import { readFileSync, writeFileSync } from 'node:fs';
const body = readFileSync(new URL('../game.html', import.meta.url), 'utf8');
const head = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="Vet Clinic">
<meta name="theme-color" content="#DDF3EE">
<style>html{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}[hidden]{display:none!important}img{max-width:100%}</style>
`;
const [first, ...rest] = body.split('<div id="app"></div>');
writeFileSync(new URL('../index.html', import.meta.url), head + first + '</head>\n<body>\n<div id="app"></div>' + rest.join('') + '\n</body>\n</html>\n');
console.log('index.html written');
