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
        const uploaders = await Uploader.find().populate({
			path: 'walls',
			options: {
				sort: { createdAt: -1 },
				collation: { locale: 'en_US', numericOrdering: true },
			},
		}).select('-password');

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
Route -		GET api/uploaders/walls/downloaded/count?userId=:userId
Desc -		Get downloaded walls count of uploader through user Id
Access -	Public
*/
router.get("/walls/downloaded/count", async (req, res) => {
	try {
		const userId = req.query.userId;
		const uploader = await Uploader.findById(userId).populate({
			path: 'walls', 
			match: { timesDownloaded: { $gt: 1 } },
			select: '_id'
		});
		return res.json(uploader.walls.length);
	} catch(err) {
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
Route -		GET api/uploaders/walls/downloaded/queries?userId=:userId&page=:page
Desc -		Get downloaded walls of uploader through user Id and page
Access -	Public
*/
router.get("/walls/downloaded/queries", async (req, res) => {
	try {
		const userId = req.query.userId
		const page = req.query.page;
		const numberOfWalls = 50;

		const uploaderWalls = await Uploader.findById(userId).populate({
			path: 'walls',
			match: { timesDownloaded: { $gt: 1 } },
			options: {
				sort: { createdAt: -1 },
				collation: { locale: 'en_US', numericOrdering: true },
				skip: page * numberOfWalls,
				limit: numberOfWalls
			},
		}).select('-password');

		return res.json(uploaderWalls.walls);
	} catch(err) {
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
Route -		GET api/uploaders/walls/liked/count?userId=:userId
Desc -		Get liked walls count of uploader through user Id
Access -	Public
*/
router.get("/walls/liked/count", async (req, res) => {
	try {
		const userId = req.query.userId;
		const uploader = await Uploader.findById(userId).populate({
			path: 'walls', 
			match: { timesFavourite: { $gt: 1 } },
			select: '_id'
		});
		return res.json(uploader.walls.length);
	} catch(err) {
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
Route -		GET api/uploaders/walls/liked/queries?userId=:userId&page=:page
Desc -		Get liked walls of uploader through user Id and page
Access -	Public
*/
router.get("/walls/liked/queries", async (req, res) => {
	try {
		const userId = req.query.userId
		const page = req.query.page;
		const numberOfWalls = 50;

		const uploaderWalls = await Uploader.findById(userId).populate({
			path: 'walls',
			match: { timesFavourite: { $gt: 1 } },
			options: {
				sort: { createdAt: -1 },
				collation: { locale: 'en_US', numericOrdering: true },
				skip: page * numberOfWalls,
				limit: numberOfWalls
			},
		}).select('-password');

		return res.json(uploaderWalls.walls);
	} catch(err) {
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
Route -		GET api/uploaders/walls/count?userId=:userId
Desc -		Get wall count of uploader through user Id
Access -	Public
*/
router.get("/walls/count", async (req, res) => {
	try {
		const userId = req.query.userId;
		const uploader = await Uploader.findById(userId).populate('walls');
		const walls = await Walls.find();
		let wallLength = 0;
		for (let i = 0; i < uploader.walls.length; i++) {
			let wallU = uploader.walls[i];
			wallLength += walls.filter(wall => wall.id === wallU.id).length;
		}
		return res.json(wallLength);
	} catch(err) {
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
		}).select('-password');

		if (uploader) {
			return res.json(uploader);
		} else {
			return res.json({});
		}
	} catch(err) {
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
		}).select('-password');

		return res.json(uploaderWalls);
	} catch(err) {
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