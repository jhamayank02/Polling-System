const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const pollsRoutes = require('./routes/polls');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

const PORT = process.env.PORT;


// Database
// index.js
const sequelize = require('./db');
const Poll = require('./schema/poll');
const Option = require('./schema/option');
const Vote = require('./schema/vote');
const { voteUpdatesConsumer, pollCreatedConsumer } = require('./kafka/consumer');
const { createTopic } = require('./kafka/admin');

// Sync all models to the database
async function syncDatabase() {
    try {
        // await sequelize.sync({ force: true });  // 'force: true' will drop existing tables before creating new ones
        await sequelize.sync({});
        console.log('All tables created successfully!');
    } catch (error) {
        console.error('Error syncing database:', error.message);
        process.exit(1);
    }
}

syncDatabase();

app.set("io", io);
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello World!");
})
app.use('/polls', pollsRoutes);

io.on('connection', (socket) => {
    console.log('A user connected', socket.id);

    socket.on('disconnect', () => {
        console.log('A user disconnected', socket.id);
    })
})

// Create Kafka topics
const initTopics = async () => {
    try {
        await createTopic('vote-updates', io, 1);
    } catch (error) {
        throw new Error(error.message);
    }
}
server.listen(PORT, () => {
    console.log("Server is listening on port ", PORT);
    initTopics('vote-updates');
    initTopics('poll-created');
    voteUpdatesConsumer();
    pollCreatedConsumer();
})