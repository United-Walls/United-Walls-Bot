const express = require('express');
const Collections = require('../models/Collections');
const router = express.Router();
const axios = require('axios');
const TgBot = require('../TgBot');

/*
Route -     GET api/collections
Desc -      Get all collections
Access -    Public
*/

router.get("/", async (req, res) => {
    try {
        const collections = await Collections
                                .find()
                                .populate({ path: 'walls' })
                                .sort({ name: 1 });

        return res.json(collections);
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
Route -     GET api/collections/:id
Desc -      Get Collection by id
Access -    Public
*/

router.get('/:id', async (req, res) => {
	try {
		const collection = await Collections
                                .findById(req.params.id)
                                .populate({ path: 'walls' });

		return res.json(collection);
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
Route -     POST api/collections
Desc -      Post New Collection
Access -    Public
*/

router.post("/", async (req, res) => {
    try {
        const { name, walls } = req.body;

        const checkCollection = await Collections
                                .findOne({  name: name });

        if (!checkCollection || checkCollection == null || checkCollection == undefined) {
            await Collections.create({
                                name: name,
                                walls: walls
                            });

            const collection = await Collections.findOne({ name: name }).populate({ path: "walls" });

            return res.json(collection);
        } else {
            await Collections.findOneAndUpdate({ name: name }, { walls: walls });

            const newCollectionAfterUpdate = await Collections
                                                    .findOne({ name: name })
                                                    .populate({ path: 'walls' });

            return res.json(newCollectionAfterUpdate);
        }
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
Route -     POST api/collections/deleteWall
Desc -      Remove Wallpaper from Collection
Access -    Public
*/

router.post('/deleteWall', async (req, res) => {
    try {
        const { name, wallId } = req.body;

        await Collections.findOneAndUpdate({ name: name }, { $pull: { walls: wallId }});

        const newCollectionAfterUpdate = await Collections
                                                .findOne({ name: name })
                                                .populate({ path: 'walls' });

        return res.json(newCollectionAfterUpdate);
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
Route -     POST api/collections/deleteCollection
Desc -      Delete a Collection
Access -    Public
*/

router.post('/deleteCollection', async (req, res) => {
    try {
        const { name } = req.body;

        await Collections.findOneAndDelete({ name: name });

        const collections = await Collections
                                .find()
                                .populate({ path: 'walls' })
                                .sort({ name: 1 });

        return res.json(collections);
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

module.exports = router;