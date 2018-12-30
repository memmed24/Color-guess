var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
const bodyParser = require('body-parser');
const brain = require('brain.js');



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(express.static(__dirname + '\\public'));

app.set('view engine', "jade");

app.get('/', (req, res) => {
    let network = new brain.NeuralNetwork();
    network.train([
        { input: { r: 0.62, g: 0.72, b: 0.88 }, output: { light: 1 } },
        { input: { r: 0.1, g: 0.84, b: 0.72 }, output: { light: 1 } },
        { input: { r: 0.33, g: 0.24, b: 0.29 }, output: { dark: 1 } },
        { input: { r: 0.74, g: 0.78, b: 0.86 }, output: { light: 1 } },
        { input: { r: 0.31, g: 0.35, b: 0.41 }, output: { dark: 1 } },
        { input: { r: 1, g: 0.99, b: 0 }, output: { light: 1 } },
        { input: { r: 1, g: 0.42, b: 0.52 }, output: { dark: 1 } },
    ]);

    const result = brain.likely({ r: 255, g: 255, b: 0 }, network);
    res.render('sample', {
        title: 'Jade hello',
        color: result
    });
});


function result(current_value) {
    let network = new brain.NeuralNetwork();
    network.train([
        { input: { r: 0.62, g: 0.72, b: 0.88 }, output: { light: 1 } },
        { input: { r: 0.1, g: 0.84, b: 0.72 }, output: { light: 1 } },
        { input: { r: 0.33, g: 0.24, b: 0.29 }, output: { dark: 1 } },
        { input: { r: 0.74, g: 0.78, b: 0.86 }, output: { light: 1 } },
        { input: { r: 0.31, g: 0.35, b: 0.41 }, output: { dark: 1 } },
        { input: { r: 1, g: 0.99, b: 0 }, output: { light: 1 } },
        { input: { r: 1, g: 0.42, b: 0.52 }, output: { dark: 1 } },
    ]);


    const result = brain.likely(current_value, network);
    return result;
}

io.on('connection', (socket) => {
    socket.on('colorchanged', (data) => {
        let res = result(data.hex_color);
        let response = {};
        response = {
            color: res
        }
        socket.emit('newcolor', response);
    })
})

server.listen(4200);  