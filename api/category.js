const express = require('express');
const Category = require('../models/Category');
const router = express.Router();
const axios = require('axios');

/*
Route -     GET api/category
Desc -      Get all categories
Access -    Public
*/

router.get("/", async (req, res) => {
    try {
        const categories = await Category.find().populate({ path: 'walls', options: { sort: { 'file_name': 1 } } }).sort({ name: 1 });
        let editedCategories = await Promise.all(categories.map(async (category) => {
            let newWalls = await Promise.all(category.walls.map(async (wall) => {
                const response = await axios.get(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getFile?file_id=${wall.file_id}`);
                return {
                    ...wall._doc,
                    file_url: `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${response.data.result.file_path}`
                };
            }));
            return {
                ...category._doc,
                walls: newWalls
            }
        }));
        return res.json(editedCategories);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            errors: [{
                msg: "WTF did you do now? Fuck you! This is a fucking Server Error, thanks for fucking it up asshole!"
            }]
        });
    }
});

/*
Route -     GET api/category/:category_id
Desc -      Get category by id
Access -    Public
*/

router.get("/:category_id", async (req, res) => {
    try {
        const category = await Category.findById(req.params.category_id).populate({ path: 'walls', options: { sort: { 'file_name': 1 } } });
        let newWalls = await Promise.all(category.walls.map(async (wall) => {
            const response = await axios.get(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getFile?file_id=${wall.file_id}`);
            return {
                ...wall._doc,
                file_url: `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${response.data.result.file_path}`
            };
        }));
        return res.json({
            ...category._doc,
            walls: newWalls
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            errors: [{
                msg: "WTF did you do now? Fuck you! This is a fucking Server Error, thanks for fucking it up asshole!"
            }]
        });
    }
})

module.exports = router