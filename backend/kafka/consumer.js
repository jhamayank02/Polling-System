const { Kafka } = require('./client');

exports.voteUpdatesConsumer = async () => {
    const consumer = Kafka.consumer({ groupId: 'polls-group' });
    console.log('Connecting consumer...');
    await consumer.connect();
    console.log('Consumer connected!');

    console.log('Subscribing to topic [vote-updates]...');
    await consumer.subscribe({ topic: "vote-updates"});
    console.log('Subscribed to topic [vote-updates]!');

    await consumer.run({
        eachMessage: async (data) => {
            const { topic, partition, message } = data;
            console.log(
                `[${topic}]: PART:${partition}:`,
                message.value.toString()
            );
        },
    });
}

exports.pollCreatedConsumer = async () => {
    const consumer = Kafka.consumer({ groupId: 'polls-group' });
    console.log('Connecting consumer...');
    await consumer.connect();
    console.log('Consumer connected!');

    console.log('Subscribing to topic [poll-created]...');
    await consumer.subscribe({ topic: "poll-created"});
    console.log('Subscribed to topic [poll-created]!');

    await consumer.run({
        eachMessage: async (data) => {
            const { topic, partition, message } = data;
            console.log(
                `[${topic}]: PART:${partition}:`,
                message.value.toString()
            );
        },
    });
}