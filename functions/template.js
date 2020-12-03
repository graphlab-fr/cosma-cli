const fs = require('fs')
    , pug = require('pug');

const htmlRender = pug.compileFile('template/scope.pug')({})

fs.writeFile('cosmographe.html', htmlRender, (err) => {
    if (err) { console.error( 'Err. write home index file: ' + err) }
    console.log('create index.html file');
});