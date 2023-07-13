const express = require('express');
const Category = require('../models/Category');
const router = express.Router();
const axios = require('axios');
const TgBot = require('../TgBot');

/*
Route -     GET api/category
Desc -      Get all categories
Access -    Public
*/

router.get('/', async (req, res) => {
	try {
		let categories = await Category.find()
			.populate({
				path: 'walls',
				options: {
					sort: { file_name: 1 },
					collation: { locale: 'en_US', numericOrdering: true },
				},
			})
			.sort({ name: 1 });
		categories = categories.filter((category) => category.walls.length >= 0)
		return res.json(categories);
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
Route -     GET api/category/:category_id
Desc -      Get category by id
Access -    Public
*/

router.get('/:category_id', async (req, res) => {
	try {
		const category = await Category.findById(req.params.category_id).populate({
			path: 'walls',
			options: {
				sort: { file_name: 1 },
				collation: { locale: 'en_US', numericOrdering: true },
			},
		});
		return res.json(category);
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
