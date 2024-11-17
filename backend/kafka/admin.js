const Option = require('../schema/option');
const Poll = require('../schema/poll');
const {Kafka} = require('./client');

exports.createTopic = async (topic, io, numPartitions)=>{
    const admin =  Kafka.admin();

    // Connect Admin
    console.log("Admin is connecting...");
    await admin.connect();
    console.log("Admin connected successfully!");

    // Create Topic
    console.log(`Creating topic: [${topic}]...`);
    await admin.createTopics({
        topics: [
            {topic, numPartitions}
        ]
    });
    console.log(`[${topic}] topic created successfully!`);


    // Insert the poll topic and options in the database
    // const createdPoll = await Poll.create({
    //     question: topic,
    //     Options: [
    //         ...options
    //     ]
    // }, {
    //     include: [Option]
    // });

    // // Broadcast the topic creation
    // io.emit('POLL_CREATED', {
    //     data: {
    //         poll: createdPoll.dataValues
    //     }
    // });

    // Disconnect Admin
    await admin.disconnect();
}