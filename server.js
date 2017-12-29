
var path = require('path');
var express = require('express');
var port = 8080;

var app = express();

app.use(express.static(__dirname + '/'))

app.get('/', function (req, res) {
    res.sendFile(path.resolve(__dirname, 'index.html'))
})
app.get('/catalogo', function (req, res) {
    res.sendFile(path.resolve(__dirname, 'category.html'))
})
app.get('/catalogo-2', function (req, res) {
    res.sendFile(path.resolve(__dirname, 'category-2.html'))
})
app.get('/contacto', function (req, res) {
    res.sendFile(path.resolve(__dirname, 'contact.html'))
})

app.get('/catalogo/:id', function(req, res){
    res.sendFile(path.resolve(__dirname, 'product-details.html'))
    
})
app.listen(port)
console.log("server run")