const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
const sequelize = require('./config/db');
const Rider = require('./models/rider.model.js');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

sequelize.sync();

app.get('/', async (req, res) => {
    const riders = await Rider.findAll();
    res.render('index', { riders });
});

app.post('/add-rider',  async(req,res) => {
    const {name, latitude, longitude } = req.body;
    const newRider = await Rider.create({name, latitude, longitude})
     res.status(201).json(newRider)
})

app.post('/update-location', async (req,res) => {
    const {id, latitude, longitude }= req.body;
    const rider = await Rider.findByPk(id);
    if (rider) {
        rider.latitude = latitude;
        rider.longitude = longitude;
        rider.last_updated = new Date();
        await rider.save();
        io.emit('update-location', { id, latitude, longitude });
        res.status(200).send('Location updated');
    } else {
        res.status(404).send('Rider not found');
    }
   
})

// WebSocket connection
io.on('connection', (socket) => {
    console.log('New user connected');
    
    // Send all riders' locations on connection
    Rider.findAll().then(riders => {
        socket.emit('initial-locations', riders);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});



server.listen(3000,() => {
    console.log('server is running')
})