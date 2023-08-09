const express = require('express');
const Walls = require('../models/Walls');
const router = express.Router();
const TgBot = require('../TgBot');
var fs = require('fs');
const Category = require('../models/Category');
const WallOfDay = require('../models/WallOfDay');
const Uploader = require('../models/Uploader');
const shuffle = (array) => {
	let currentIndex = array.length,  randomIndex;

	// While there remain elements to shuffle.
	while (currentIndex != 0) {

		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}

	return array;
}

/*
Route -		GET /api/walls/wallOfDay
Desc -		Get Random Wall of Day (Runs every day)
Acces -		Public
*/
router.get('/wallOfDay', async (req, res) => {
	try {
		if (req.query.index) {
			const index = req.query.index;

			const walls = await Walls.find();
	
			let wallByIndex = walls[index];
			
			let wallOfDayExists = await WallOfDay.find({ wall: wallByIndex });

			if (wallOfDayExists.length > 0) {
				return;
			}
			
			let newWallOfDay = await WallOfDay.create({
				wall: wallByIndex
			});
		}

		const wallOfDay = await WallOfDay.find().populate('wall').sort({ createdAt: -1 });
		return res.json(wallOfDay[0].wall);
	} catch (err) {
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
Route -		GET api/walls/mostLikedWall
Desc -		Get Most Liked Wall
Access -	Public
*/

router.get('/mostLikedWall', async (req, res) => {
	try {
		const walls = await Walls.find({ timesFavourite: { $gt: 0 } }).sort({ timesFavourite: -1 }).collation({
			locale: 'en_US',
			numericOrdering: true,
		}).limit(1);
	
		return res.json(walls[0]);
	} catch (err) {
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
Route -		GET api/walls/mostDownloadedWall
Desc -		Get Most downloaded Wall
Access -	Public
*/

router.get('/mostDownloadedWall', async (req, res) => {
	try {
		const walls = await Walls.find({ timesDownloaded: { $gt: 0 } }).sort({ timesDownloaded: -1 }).collation({
			locale: 'en_US',
			numericOrdering: true,
		}).limit(1);
	
		return res.json(walls[0]);
	} catch (err) {
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
Route -		GET api/walls/mostDownloaded
Desc -		Get Most downloaded Walls
Access - 	Public
*/
router.get('/mostDownloaded', async(req, res) => {
	try {
		const walls = await Walls.find({ timesDownloaded: { $gt: 0 } }).sort({ timesDownloaded: -1 }).collation({
			locale: 'en_US',
			numericOrdering: true,
		}).limit(50);

		return res.json(walls);
	} catch (err) {
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
Route -		GET api/walls/mostFavourited
Desc -		Get Most Favourited Walls
Access - 	Public
*/
router.get('/mostFavourited', async(req, res) => {
	try {
		const walls = await Walls.find({ timesFavourite: { $gt: 0 }}).sort({ timesFavourite: -1 }).collation({
			locale: 'en_US',
			numericOrdering: true,
		}).limit(50);

		return res.json(walls)
	} catch (err) {
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
Route -		GET api/walls/count
Desc -		Get Walls Count
Access - 	Public
*/
router.get('/count', async (req, res) => {
	try {
		const count = await Walls.count();
		return res.json(count)
	} catch (err) {
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
Route -     GET api/walls/queries?page=:page
Desc -      Get all walls by pages
Access -    Public
*/

router.get('/queries', async (req, res) => {
	try {
		const page = req.query.page;
		const numberOfWalls = 50;

		const walls = await Walls.find({ hidden: false }).sort({ createdAt: -1 }).collation({
			locale: 'en_US',
			numericOrdering: true,
		}).select('-timesFavourite -timesDownloaded -hidden').skip(page * numberOfWalls).limit(numberOfWalls)

		return res.json(shuffle(walls));
	} catch (err) {
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
Route -     GET api/walls/addDownloaded?wallId=:wallId
Desc -      Add 1 to timesDownloaded
Access -    Public
*/

router.get('/addDownloaded', async (req, res) => {
	try {
		const wallId = req.query.wallId;
		await Walls.findByIdAndUpdate(wallId, { $inc: { timesDownloaded: 1 }});
		const updatedWall = await Walls.findById(wallId);
		return res.json(updatedWall);
	} catch (err) {
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
Route -     GET api/walls/addFav?wallId=:wallId
Desc -      Add 1 to timesFavourite
Access -    Public
*/

router.get('/addFav', async (req, res) => {
	try {
		const wallId = req.query.wallId;
		await Walls.findByIdAndUpdate(wallId, { $inc: { timesFavourite: 1 }});
		const updatedWall = await Walls.findById(wallId);
		return res.json(updatedWall);
	} catch (err) {
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
Route -     GET api/walls/removeFav?wallId=:wallId
Desc -      Remove 1 to timesFavourite
Access -    Public
*/

router.get('/removeFav', async (req, res) => {
	try {
		const wallId = req.query.wallId;
		const getWall = await Walls.findById(wallId);
		if(getWall.timesFavourite > 0) {
			await Walls.findByIdAndUpdate(wallId, { $inc: { timesFavourite: -1 }});
		}
		const updatedWall = await Walls.findById(wallId);
		return res.json(updatedWall);
	} catch (err) {
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
Route -     GET api/walls/update
Desc -      Get all walls
Access -    Public
*/

// router.get('/update', async (req, res) => {
// 	try {
// 		const d = new Date();
// 		console.log("Running update \nUpdate Time: " + d.toString())
// 		const walls = await Walls.find();

// 		await Promise.all(
// 			walls.map(async (wall, index) => {
// 				await Walls.findByIdAndUpdate(wall.id, {
// 					hidden: false
// 				})
// 				return;
// 			})
// 		)

// 		return res.sendStatus(204);
// 	} catch (err) {
// 		console.error(err.message);
// 		res.status(500).json({
// 			errors: [
// 				{
// 					msg: 'WTF did you do now? Fuck you! This is a fucking Server Error, thanks for fucking it up asshole!',
// 				},
// 			],
// 		});
// 	}
// });

/*
Route -     GET api/walls
Desc -      Get all walls
Access -    Public
*/

router.get('/', async (req, res) => {
	try {
		let walls = await Walls.find({ hidden: false }).sort({ createdAt: -1 }).collation({
			locale: 'en_US',
			numericOrdering: true,
		});
		return res.json(walls);
	} catch (err) {
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
Route -     GET api/walls/:wall_id
Desc -      Get Wall by ID
Access -    Public
*/

router.get('/:wall_id', async (req, res) => {
	try {
		const wall = await Walls.findById(req.params.wall_id);
		return res.json(wall);
	} catch (err) {
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
