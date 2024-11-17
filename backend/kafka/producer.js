const { Sequelize } = require('sequelize');
const Option = require('../schema/option');
const Poll = require('../schema/poll');
const { Kafka } = require('./client');

exports.giveVotesProducer = async ({ pollId, optionId }, io, partition) => {
    const producer = Kafka.producer();

    // Connect Producer
    console.log("Connecting producer...");
    await producer.connect();
    console.log("Producer connected successfully!");

    const poll = await Poll.findByPk(pollId);

    // Send Data
    await producer.send({
        topic: 'vote-updates',
        messages: [
            {
                partition,
                key: 'vote-updates', value: JSON.stringify({ pollId, optionId })
            }
        ]
    });

    // Update Database
    const incrementCount = 1;
    await Option.update(
        { voteCount: Sequelize.literal(`"Options"."voteCount" + ${incrementCount}`) },
        { where: { id: optionId } }
    );

    io.emit('VOTE_RECEIVED', {
        pollId: pollId,
        optionId: optionId
    })

    // Disconnect Producer
    await producer.disconnect();
}

exports.pollCreatedProducer = async ({ topic, options }, io, partition) => {
    const producer = Kafka.producer();

    // Connect Producer
    console.log("Connecting producer...");
    await producer.connect();
    console.log("Producer connected successfully!");

    // Insert the poll topic and options in the database
    const createdPoll = await Poll.create({
        question: topic,
        Options: [
            ...options
        ]
    }, {
        include: [Option]
    });

    // // Broadcast the topic creation
    io.emit('POLL_CREATED', {
        data: {
            poll: createdPoll.dataValues
        }
    });

    // Send Data
    await producer.send({
        topic: 'poll-created',
        messages: [
            {
                partition,
                key: 'poll-created', value: JSON.stringify({topic, options})
            }
        ]
    });

    // Disconnect Producer
    await producer.disconnect();
}