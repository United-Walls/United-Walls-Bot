const express = require('express');
const Walls = require('../models/Walls');
const router = express.Router();
const TgBot = require('../TgBot');
var fs = require('fs');
const Category = require('../models/Category');
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
			-1001747180858,
			`Error: Hey, @ParasKCD, wake up! There was an error in the United Walls Server. Might have crashed, don't know.\n\nHere's the Error\n\n${err.message}`
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
			-1001747180858,
			`Error: Hey, @ParasKCD, wake up! There was an error in the United Walls Server. Might have crashed, don't know.\n\nHere's the Error\n\n${err.message}`
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
			-1001747180858,
			`Error: Hey, @ParasKCD, wake up! There was an error in the United Walls Server. Might have crashed, don't know.\n\nHere's the Error\n\n${err.message}`
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

		const walls = await Walls.find().sort({ createdAt: -1 }).collation({
			locale: 'en_US',
			numericOrdering: true,
		}).skip(page * numberOfWalls).limit(numberOfWalls);

		return res.json(shuffle(walls));
	} catch (err) {
		console.error(err.message);
		TgBot.api.sendMessage(
			-1001747180858,
			`Error: Hey, @ParasKCD, wake up! There was an error in the United Walls Server. Might have crashed, don't know.\n\nHere's the Error\n\n${err.message}`
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
			-1001747180858,
			`Error: Hey, @ParasKCD, wake up! There was an error in the United Walls Server. Might have crashed, don't know.\n\nHere's the Error\n\n${err.message}`
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
			-1001747180858,
			`Error: Hey, @ParasKCD, wake up! There was an error in the United Walls Server. Might have crashed, don't know.\n\nHere's the Error\n\n${err.message}`
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
			-1001747180858,
			`Error: Hey, @ParasKCD, wake up! There was an error in the United Walls Server. Might have crashed, don't know.\n\nHere's the Error\n\n${err.message}`
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

// /*
// Route -     GET api/walls/update
// Desc -      Get all walls
// Access -    Public
// */

// router.get('/update', async (req, res) => {
// 	try {
// 		const d = new Date();
// 		console.log("Running update \nUpdate Time: " + d.toString())
// 		const walls = await Walls.find();

// 		await Promise.all(
// 			walls.map(async (wall, index) => {
// 				const category = await Category.findById(wall.category);

// 				fs.mkdir(`/home/paraskcd/United-Walls-Bot/storage/wallpapers/${category.name.replace(/\s/g, '')}/thumbnails`, { recursive: true }, (err) => {
// 					if(err) {
// 						//note: this does NOT get triggered if the directory already existed
// 						console.warn(err)
// 					}
// 					else{
// 						//directory now exists 
// 					}
// 				});

// 				const response = await TgBot.api.getFile(wall.file_id);
// 				const response2 = await TgBot.api.getFile(wall.thumbnail_id);
				
// 				if (fs.existsSync(`/home/paraskcd/United-Walls-Bot/storage/wallpapers/${category.name.replace(/\s/g, '')}/${wall.file_name}.${wall.mime_type == "image/jpeg" ? "jpg" : "png"}`)) {
// 					fs.rm(response.file_path, { recursive:true }, (err) => {
// 						if(err){
// 							// File deletion failed
// 							console.error(err.message);
// 							return;
// 						}
// 						console.log("File deleted successfully");
// 					});
// 				} else {
// 					fs.copyFile(response.file_path, `/home/paraskcd/United-Walls-Bot/storage/wallpapers/${category.name.replace(/\s/g, '')}/${wall.file_name}.${wall.mime_type == "image/jpeg" ? "jpg" : "png"}`, (err) => {
// 						if (err) {
// 						  console.log("Error Found:", err);
// 						}
// 					});
// 				}
				
// 				if (fs.existsSync(`/home/paraskcd/United-Walls-Bot/storage/wallpapers/${category.name.replace(/\s/g, '')}/thumbnails/${wall.file_name}.${wall.mime_type == "image/jpeg" ? "jpg" : "png"}`)) {
// 					fs.rm(response2.file_path, { recursive:true }, (err) => {
// 						if(err){
// 							// File deletion failed
// 							console.error(err.message);
// 							return;
// 						}
// 						console.log("File deleted successfully");
// 					});
// 				} else {
// 					fs.copyFile(response2.file_path, `/home/paraskcd/United-Walls-Bot/storage/wallpapers/${category.name.replace(/\s/g, '')}/thumbnails/${wall.file_name}.${wall.mime_type == "image/jpeg" ? "jpg" : "png"}`, (err) => {
// 						if (err) {
// 						  console.log("Error Found:", err);
// 						}
// 					});
// 				}
				
// 				await Walls.findByIdAndUpdate(wall.id, { 
// 					file_url: `http://unitedwalls.paraskcd.com/image/${category.name.replace(/\s/g, '')}/${wall.file_name}.${wall.mime_type == "image/jpeg" ? "jpg" : "png"}`,
// 					thumbnail_url: `http://unitedwalls.paraskcd.com/image/${category.name.replace(/\s/g, '')}/thumbnails/${wall.file_name}.${wall.mime_type == "image/jpeg" ? "jpg" : "png"}`
// 				});

// 				return;
// 			})
// 		)

// 		return
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
		const walls = await Walls.find().sort({ createdAt: -1 }).collation({
			locale: 'en_US',
			numericOrdering: true,
		});
		return res.json(walls);
	} catch (err) {
		console.error(err.message);
		TgBot.api.sendMessage(
			-1001747180858,
			`Error: Hey, @ParasKCD, wake up! There was an error in the United Walls Server. Might have crashed, don't know.\n\nHere's the Error\n\n${err.message}`
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
			-1001747180858,
			`Error: Hey, @ParasKCD, wake up! There was an error in the United Walls Server. Might have crashed, don't know.\n\nHere's the Error\n\n${err.message}`
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
