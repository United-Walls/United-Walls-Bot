const express = require('express');
const Category = require('../models/Category');
const router = express.Router();
const axios = require('axios');

/*
Route -     GET api/category
Desc -      Get all categories
Access -    Public
*/

router.get('/', async (req, res) => {
	try {
		const categories = await Category.find()
			.populate({
				path: 'walls',
				options: {
					sort: { file_name: 1 },
					collation: { locale: 'en_US', numericOrdering: true },
				},
			})
			.sort({ name: 1 });
		return res.json(categories);
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
