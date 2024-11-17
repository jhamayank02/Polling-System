const express = require('express');
const { createPoll, vote, getVotes, polls } = require('../controllers/polls');
const router = express.Router();

router.get('/', polls);
router.post('/:id/vote', vote);
router.get('/:id', getVotes);
router.post('/', createPoll);

module.exports = router;