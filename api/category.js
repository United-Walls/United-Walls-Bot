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

/*
Route -		GET api/category/walls/count?categoryId=:categoryId
Desc -		Get wall count of category through category Id
Access -	Public
*/
router.get("/walls/count", async (req, res) => {
	try {
		const categoryId = req.query.categoryId;
		const category = await Category.findById(categoryId);
		return res.json(category.walls.length);
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
Route -     GET api/category/wall?wallId=:wallId
Desc -      Get category with wallId
Access -    Public
*/
router.get("/wall", async (req, res) => {
	try {
		const wallId = req.query.wallId;
		const category = await Category.findOne({walls: { $in: [wallId] }}).populate({
			path: 'walls',
			options: {
				sort: { file_name: 1 },
				collation: { locale: 'en_US', numericOrdering: true },
			},
		});

		if (category) {
			return res.json(category);
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
Route -     GET api/category/walls/queries?categoryId=:categoryId&page=:page
Desc -      Get all walls from category
Access -    Public
*/
router.get("/walls/queries", async (req, res) => {
	try {
		const categoryId = req.query.categoryId
		const page = req.query.page;
		const numberOfWalls = 50;

		const categoryWalls = await Category.findById(categoryId).populate({
			path: 'walls',
			options: {
				sort: { file_name: 1 },
				collation: { locale: 'en_US', numericOrdering: true },
				skip: page * numberOfWalls,
				limit: numberOfWalls
			},
		});

		return res.json(categoryWalls);
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
