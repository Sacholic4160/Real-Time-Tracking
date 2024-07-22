const express = require('express')
const app = express();
const http = require('http')

const socketio = require('socket.io')

const server = http.createServer(app);

const io = socketio(server);



app.get('/', (req,res) => {
    res.send('hey')
})

server.listen(3000,() => {
    console.log('server is running')
})