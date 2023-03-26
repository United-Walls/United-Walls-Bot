const express = require('express');
const Walls = require('../models/Walls');
const router = express.Router();
const TgBot = require('../TgBot')

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
			walls.map(async (wall) => {
				const response = await TgBot.api.getFile(wall.file_id);
				return await Walls.findByIdAndUpdate(wall.id, { file_url: `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${response.file_path}` });
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
