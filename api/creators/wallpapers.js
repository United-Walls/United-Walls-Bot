const express = require('express');
const verifyToken = require('../../middleware/auth');
const TgBot = require('../../TgBot');
const Walls = require('../../models/Walls');
const Category = require('../../models/Category');
const Uploader = require('../../models/Uploader');
const router = express.Router();
const fs = require('fs');

/*
Route -     POST api/creators/wallpapers?wallId=:wallId
Desc -      Update a wallpaper
Access -    Public
*/
router.post('/', verifyToken, async (req, res) => {
    try {
        const { wallId } = req.query;
        const { file_name, category } = req.body;
        const cat = await Category.findById(category);
        const wall = await Walls.findById(wallId);
        const creator = await Uploader.findById(wall.creator);

        if (req.user.id === creator.id) {
            const updatedWall = await Walls.findByIdAndUpdate(wallId, { file_name, category: cat });
            return res.status(201).json(updatedWall);
        } else {
            return res.status(401).send("Ok who the fuck? Bro are you lost? If you got this message, it means you either fucked up something, don't have the necessary stuff I need, aren't authorized, or you just a plain dumbass. Now Fuck OFF!");
        }
    } catch (err) {
        console.error(err);
        TgBot.api.sendMessage(
			-1001731686694,
			`Error: Hey, @ParasKCD, wake up! There was an error in the United Walls Server. Might have crashed, don't know.\n\nHere's the Error\n\n${err.message}`, { message_thread_id: 77299 }
		);
        return res.status(500).send("Something went wrong. Please try again.");
    }
});

/*
Route -     DELETE api/creators/wallpapers?wallId=:wallId
Desc -      Delete a wallpaper
Access -    Public
*/
router.delete('/', verifyToken, async (req, res) => {
    try {
        const { wallId } = req.query;
        const deletedWall = await Walls.findByIdAndDelete(wallId);
        console.log("deletedwall", deletedWall);
        let category = await Category.findByIdAndUpdate(deletedWall.category, {
            $pull: { walls: deletedWall.id }
        });   
        await Uploader.findByIdAndUpdate(deletedWall.creator, {
            $pull: { walls: deletedWall.id }
        });
        category = await Category.findById(deleteWall.category);
        if (category.walls.length == 0) {
            await Category.findByIdAndDelete(deletedWall.category);
        }

        fs.stat(`./storage/wallpapers/${category.name}/${deletedWall.file_name}.${deletedWall.file_ext}`, function (err, stats) {
            if (err) {
                return console.error(err);
            }
         
            fs.unlink(`./storage/wallpapers/${category.name}/${deletedWall.file_name}.${deletedWall.file_ext}`,function(err){
                 if(err) return console.log(err);
                 console.log(`${category.name}/${deletedWall.file_name}.${deletedWall.file_ext} file deleted successfully from temp folder`);
            });  
        });

        fs.stat(`./storage/wallpapers/${category.name}/thumbnails/${deletedWall.file_name}.${deletedWall.file_ext}`, function (err, stats) {
            if (err) {
                return console.error(err);
            }
         
            fs.unlink(`./storage/wallpapers/${category.name}/thumbnails/${deletedWall.file_name}.${deletedWall.file_ext}`,function(err){
                 if(err) return console.log(err);
                 console.log(`${category.name}/${deletedWall.file_name}.${deletedWall.file_ext} file deleted successfully from temp folder`);
            });  
        });

        return res.status(200).json(deletedWall);
    } catch (err) {
        console.error(err);
        TgBot.api.sendMessage(
			-1001731686694,
			`Error: Hey, @ParasKCD, wake up! There was an error in the United Walls Server. Might have crashed, don't know.\n\nHere's the Error\n\n${err.message}`, { message_thread_id: 77299 }
		);
        return res.status(500).send("Something went wrong. Please try again.");
    }
});

module.exports = router;
