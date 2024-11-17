const { Kafka } = require('kafkajs');

exports.Kafka = new Kafka({
    clientId: process.env.CLIENT_ID,
    brokers: [process.env.BROKER_ADDRESS],
    connectionTimeout: 30000,
})