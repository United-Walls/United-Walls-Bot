const express = require('express');
const router = express.Router();
const Uploader = require('../models/Uploader');
const Walls = require('../models/Walls');

/*
Route -     GET api/uploaders/
Desc -      Get all Uploaders
Access -    Public
*/

router.get("/", async (req, res) => {
    try {
        const uploaders = Uploader.find().populate({ path: 'walls' });

        return res.json(uploaders);
    } catch(err) {
        console.error(err.message);
		TgBot.api.sendMessage(
			-1001731686694,
			`Error: Hey, @ParasKCD, wake up! There was an error in the United Walls Server. Might have crashed, don't know.\n\nHere's the Error\n\n${err.message}`, { message_thread_id: 77299 }
		);
		res.status(500).json({
			errors: [
				{
					msg: 'Lol',
				},
			],
		});
    }
});

module.exports = router;