
const express = require('express');
const router = express.Router();
const Poll = require('../Model/poll');
const Vote = require('../Model/vote'); 
const auth = require('../middleware/authMiddleware');


router.get('/', async (req, res) => {
  try {
    const { filter } = req.query; 
    const now = new Date();
    let polls = await Poll.find().sort({ createdAt: -1 });

    if (filter === 'active') polls = polls.filter(p => new Date(p.expiresAt) > now);
    if (filter === 'expired') polls = polls.filter(p => new Date(p.expiresAt) <= now);

    res.json(polls);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




router.post("/postspoll", auth, async (req, res) => {
  try {
    const { question, options, expiresAt } = req.body;

    console.log("BODY:", req.body);


    if (!question || !options || options.length < 2 || !expiresAt) {
      return res.status(400).json({ error: "Please fill all fields with 2+ options and expiration date" });
    }


    const formattedOptions = options.map(opt => {
      if (typeof opt === "string") {
        return { text: opt, votes: 0 };
      }
      return {
        text: opt.text,
        votes: opt.votes || 0
      };
    });


    const poll = await Poll.create({
      question,
      options: formattedOptions,
      expiresAt: new Date(expiresAt),
      createdBy: req.user.id,
      createdByName: req.user.name
    });

    res.status(201).json(poll);

  } catch (err) {
    console.log("CREATE POLL ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ error: 'Poll not found' });
    res.json(poll);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/user/mypolls', auth, async (req, res) => {
  try {
    const polls = await Poll.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.json(polls);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/:id/vote", async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({ error: "Poll not found" });
    }
    if (new Date() > poll.expiresAt) {
      return res.status(403).json({ error: "Poll expired" });
    }

    const { optionIndex } = req.body;

    poll.options[optionIndex].votes += 1;

    await poll.save();

    res.json(poll);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;