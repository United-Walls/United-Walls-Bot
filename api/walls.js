const express = require('express');
const Walls = require('../models/Walls');
const router = express.Router();
const TgBot = require('../TgBot');
var fs = require('fs');
const Category = require('../models/Category');

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
})

/*
Route -     GET api/walls
Desc -      Get all walls
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
Route -     GET api/walls/update
Desc -      Get all walls
Access -    Public
*/

router.get('/update', async (req, res) => {
	try {
		const d = new Date();
		console.log("Running update \nUpdate Time: " + d.toString())
		const walls = await Walls.find();

		await Promise.all(
			walls.map(async (wall, index) => {
				const response = await TgBot.api.getFile(wall.file_id);
				const response2 = await TgBot.api.getFile(wall.thumbnail_id);

				fs.rename(response.file_path, response.file_path + '.jpg', function(err) {
					if ( err ) console.log('ERROR: ' + err);
				});

				fs.rename(response2.file_path, response2.file_path + '.jpg', function(err) {
					if ( err ) console.log('ERROR: ' + err);
				});

				await Walls.findByIdAndUpdate(wall.id, { 
					file_url: `http://unitedwalls.paraskcd.com/image/${response.file_path?.split('/')[response.file_path?.split('/').length - 2]}/${response.file_path?.split('/')[response.file_path?.split('/').length - 1]}.jpg`,
					thumbnail_url: `http://unitedwalls.paraskcd.com/image/${response2.file_path?.split('/')[response2.file_path?.split('/').length - 2]}/${response2.file_path?.split('/')[response2.file_path?.split('/').length - 1]}.jpg`
				});

				return;
			})
		)

		return
	} catch (err) {
		console.error(err.message);
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
