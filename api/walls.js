const express = require('express');
const Walls = require('../models/Walls');
const router = express.Router();
const axios = require('axios');

/*
Route -     GET api/walls
Desc -      Get all walls
Access -    Public
*/

router.get('/', async (req, res) => {
    try {
        const walls = await Walls.find().sort({ file_name: 1 });
        let editedWalls = await Promise.all(walls.map(async (wall) => {
            const response = await axios.get(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getFile?file_id=${wall.file_id}`);
            return {
                ...wall._doc,
                file_url: `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${response.data.result.file_path}`
            }
        }));
        return res.json(editedWalls);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            errors: [{msg: "WTF did you do now? Fuck you! This is a fucking Server Error, thanks for fucking it up asshole!"}]
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
        const response = await axios.get(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getFile?file_id=${wall.file_id}`);
        return res.json({
            ...wall._doc,
            file_url: `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${response.data.result.file_path}`
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            errors: [{
                msg: "WTF did you do now? Fuck you! This is a fucking Server Error, thanks for fucking it up asshole!"
            }]
        });
    }
});

module.exports = router;