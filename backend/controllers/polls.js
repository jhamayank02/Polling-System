const { createTopic } = require("../kafka/admin");
const { giveVotes, createPollProducer, giveVotesProducer, pollCreatedProducer } = require("../kafka/producer");
// const { options } = require("../routes/polls");
const Option = require("../schema/option");
const Poll = require("../schema/poll");

exports.createPoll = async (req, res) => {
    try {
        let { topic, options } = req.body;

        if (!topic || topic.trim().length === 0) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "topic is a required field"
            });
        }
        if (!options || options.length === 0) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "topic is a required field"
            });
        }

        options = options.map(option => ({ option: option }));

        const data = {
            topic, options
        }

        const io = req.app.get("io");
        await pollCreatedProducer(data, io, 0);

        res.status(200).json({
            status: 200,
            success: true,
            message: `${topic} topic created successfully`
        })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            status: 500,
            success: false,
            message: err?.message || 'Something went wrong'
        })
    }
}
exports.vote = async (req, res) => {
    try {
        const { id } = req.params;
        const {optionId} = req.body;

        if (!id) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "id is a required field"
            });
        }

        const io = req.app.get("io");
        await giveVotesProducer({pollId: id, optionId}, io, 0);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Voted successfully"
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            status: 500,
            success: false,
            message: err?.message || 'Something went wrong'
        })
    }
}
exports.getVotes = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: 'poll id not provided'
            });
        }

        const poll = await Poll.findByPk(id, {
            include: [{
                model: Option,
                attributes: ['id', 'option', 'voteCount']
            }]
        });
        if(!poll){
            return res.status(400).json({
                status: 400,
                success: false,
                message: 'poll not found'
            });
        }

        res.status(200).json({
            status: 200,
            success: false,
            poll
        })

    } catch (error) {
        console.log(err.message);
        return res.status(500).json({
            status: 500,
            success: false,
            message: err?.message || 'Something went wrong'
        })
    }

}
exports.polls = async (req, res) => {
    try {
        const polls = await Poll.findAll({
            include: [{
                model: Option,
                attributes: ['id', 'option', 'voteCount']
            }]
        });
        res.status(200).json({
            status: 200,
            success: true,
            polls
        })
    } catch (error) {
        console.log(err.message);
        return res.status(500).json({
            status: 500,
            success: false,
            message: err?.message || 'Something went wrong'
        })
    }
}