const express = require('express');
const router = express.Router();
const Uploader = require('../models/Uploader');

/*
Route -     GET api/uploaders/
Desc -      Get all Uploaders
Access -    Public
*/

router.get("/", async (req, res) => {
    try {
        const uploaders = await Uploader.find().populate({
			path: 'walls',
			options: {
				sort: { createdAt: -1 },
				collation: { locale: 'en_US', numericOrdering: true },
			},
		});

        return res.json(uploaders);
    } catch(err) {
        console.error(err);
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

/*
Route -		GET api/uploaders/walls/count?userId=:userId
Desc -		Get wall count of uploader through user Id
Access -	Public
*/
router.get("/walls/count", async (req, res) => {
	try {
		const userId = req.query.userId;
		const uploader = await Uploader.findById(userId);
		return res.json(uploader.walls.length);
	} catch {
		console.error(err.message);
		TgBot.api.sendMessage(
			-1001731686694,
			`Error: Hey, @ParasKCD, wake up! There was an error in the United Walls Server. Might have crashed, don't know.\n\nHere's the Error\n\n${err.message}`, { message_thread_id: 77299 }
		);
		res.status(500).json({
			errors: [
				{
					msg: 'WTF did you do now? Fuck you! This is a fucking Server Error, thanks for fucking it up asshole!',
				},
			],
		});
	}
});

/*
Route -     GET api/uploaders/wall?wallId=:wallId
Desc -      Get uploader with wallId
Access -    Public
*/
router.get("/wall", async (req, res) => {
	try {
		const wallId = req.query.wallId;
		let uploader = await Uploader.findOne({walls: { $in: [wallId] }}).populate({
			path: 'walls',
			options: {
				sort: { createdAt: -1 },
				collation: { locale: 'en_US', numericOrdering: true },
			},
		});

		if (uploader) {
			return res.json(uploader);
		} else {
			return res.json({});
		}
	} catch {
		console.error(err.message);
		TgBot.api.sendMessage(
			-1001731686694,
			`Error: Hey, @ParasKCD, wake up! There was an error in the United Walls Server. Might have crashed, don't know.\n\nHere's the Error\n\n${err.message}`, { message_thread_id: 77299 }
		);
		res.status(500).json({
			errors: [
				{
					msg: 'WTF did you do now? Fuck you! This is a fucking Server Error, thanks for fucking it up asshole!',
				},
			],
		});
	}
})

/*
Route -     GET api/uploaders/walls/queries?userId=:userId&page=:page
Desc -      Get all walls from uploader
Access -    Public
*/
router.get("/walls/queries", async (req, res) => {
	try {
		const userId = req.query.userId
		const page = req.query.page;
		const numberOfWalls = 50;

		const uploaderWalls = await Uploader.findById(userId).populate({
			path: 'walls',
			options: {
				sort: { createdAt: -1 },
				collation: { locale: 'en_US', numericOrdering: true },
				skip: page * numberOfWalls,
				limit: numberOfWalls
			},
		});

		return res.json(uploaderWalls);
	} catch {
		console.error(err.message);
		TgBot.api.sendMessage(
			-1001731686694,
			`Error: Hey, @ParasKCD, wake up! There was an error in the United Walls Server. Might have crashed, don't know.\n\nHere's the Error\n\n${err.message}`, { message_thread_id: 77299 }
		);
		res.status(500).json({
			errors: [
				{
					msg: 'WTF did you do now? Fuck you! This is a fucking Server Error, thanks for fucking it up asshole!',
				},
			],
		});
	}
});

module.exports = router;