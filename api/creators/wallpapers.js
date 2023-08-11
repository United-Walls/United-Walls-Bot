const express = require('express');
const verifyToken = require('../../middleware/auth');
const TgBot = require('../../TgBot');
const Walls = require('../../models/Walls');
const Category = require('../../models/Category');
const Uploader = require('../../models/Uploader');
const router = express.Router();
const fs = require('fs');

/*
Route -     POST api/creators/wallpapers/admin?wallId=:wallId
Desc -      Update a wallpaper
Access -    Public
*/
router.post('/admin', verifyToken, async (req, res) => {
    try {
        const { wallId } = req.query;
        const { file_name, category } = req.body;
        const cat = await Category.findById(category);
        const wall = await Walls.findById(wallId);

        if (req.user.userID === 975024565
            || req.user.userID === 934949695
            || req.user.userID === 1889905927 
            || req.user.userID === 127070302  
            ) {
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
        const wall = await Walls.findById(wallId);
        const creator = await Uploader.findById(wall.creator);

        if (req.user.id === creator.id) {
            const deletedWall = await Walls.findByIdAndDelete(wallId);
            console.log("deletedwall", deletedWall);
            let category = await Category.findByIdAndUpdate(deletedWall.category, {
                $pull: { walls: deletedWall.id }
            });   
            await Uploader.findByIdAndUpdate(deletedWall.creator, {
                $pull: { walls: deletedWall.id }
            });
            category = await Category.findById(deletedWall.category);
            if (category.walls.length == 0) {
                await Category.findByIdAndDelete(deletedWall.category);
            }

            fs.stat(`./storage/wallpapers/${category.name.replace(/\s/g, '').trim()}/${deletedWall.file_name}.${deletedWall.file_ext}`, function (err, stats) {
                if (err) {
                    return console.error(err);
                }
            
                fs.unlink(`./storage/wallpapers/${category.name.replace(/\s/g, '').trim()}/${deletedWall.file_name}.${deletedWall.file_ext}`,function(err){
                    if(err) return console.log(err);
                    console.log(`${category.name.replace(/\s/g, '').trim()}/${deletedWall.file_name}.${deletedWall.file_ext} file deleted successfully from temp folder`);
                });  
            });

            fs.stat(`./storage/wallpapers/${category.name.replace(/\s/g, '').trim()}/thumbnails/${deletedWall.file_name}.${deletedWall.file_ext}`, function (err, stats) {
                if (err) {
                    return console.error(err);
                }
            
                fs.unlink(`./storage/wallpapers/${category.name.replace(/\s/g, '').trim()}/thumbnails/${deletedWall.file_name}.${deletedWall.file_ext}`,function(err){
                    if(err) return console.log(err);
                    console.log(`${category.name.replace(/\s/g, '').trim()}/${deletedWall.file_name}.${deletedWall.file_ext} file deleted successfully from temp folder`);
                });  
            });

            return res.status(200).json(deletedWall);
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
Route -     DELETE api/creators/wallpapers/admin?wallId=:wallId
Desc -      Delete a wallpaper
Access -    Public
*/
router.delete('/admin', verifyToken, async (req, res) => {
    try {
        const { wallId } = req.query;
        if (
            req.user.userID === 975024565
            || req.user.userID === 934949695
            || req.user.userID === 1889905927 
            || req.user.userID === 127070302
        ) {
            const deletedWall = await Walls.findByIdAndDelete(wallId);
            console.log("deletedwall", deletedWall);
            let category = await Category.findByIdAndUpdate(deletedWall.category, {
                $pull: { walls: deletedWall.id }
            });   
            await Uploader.findByIdAndUpdate(deletedWall.creator, {
                $pull: { walls: deletedWall.id }
            });
            category = await Category.findById(deletedWall.category);
            if (category.walls.length == 0) {
                await Category.findByIdAndDelete(deletedWall.category);
            }

            fs.stat(`./storage/wallpapers/${category.name.replace(/\s/g, '').trim()}/${deletedWall.file_name}.${deletedWall.file_ext}`, function (err, stats) {
                if (err) {
                    return console.error(err);
                }
            
                fs.unlink(`./storage/wallpapers/${category.name.replace(/\s/g, '').trim()}/${deletedWall.file_name}.${deletedWall.file_ext}`,function(err){
                    if(err) return console.log(err);
                    console.log(`${category.name.replace(/\s/g, '').trim()}/${deletedWall.file_name}.${deletedWall.file_ext} file deleted successfully from temp folder`);
                });  
            });

            fs.stat(`./storage/wallpapers/${category.name.replace(/\s/g, '').trim()}/thumbnails/${deletedWall.file_name}.${deletedWall.file_ext}`, function (err, stats) {
                if (err) {
                    return console.error(err);
                }
            
                fs.unlink(`./storage/wallpapers/${category.name.replace(/\s/g, '').trim()}/thumbnails/${deletedWall.file_name}.${deletedWall.file_ext}`,function(err){
                    if(err) return console.log(err);
                    console.log(`${category.name.replace(/\s/g, '').trim()}/${deletedWall.file_name}.${deletedWall.file_ext} file deleted successfully from temp folder`);
                });  
            });

            return res.status(200).json(deletedWall);
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
Route -     GET api/creators/wallpapers/admin?wallId=:wallId
Desc -      Fix a wallpaper
Access -    Private
*/
router.get('/admin', verifyToken, async (req, res) => {
    try{
        if (
            req.user.userID === 975024565
            || req.user.userID === 934949695
            || req.user.userID === 1889905927 
            || req.user.userID === 127070302
        ) {
            const newWall = await Walls.findById(req.query.wallId).populate('category');
            const categoryName = newWall.category.name.replace(/\s/g, "").trim();

            if (newWall.file_id != "" && newWall.thumbnail_id != "") {
                let fileTg = await TgBot.api.getFile(newWall.file_id);
                let thumbnailTg = await TgBot.api.getFile(newWall.thumbnail_id);

                fs.rename(fileTg.file_path, `/home/paraskcd/United-Walls-Bot/storage/wallpapers/${categoryName}/${newWall.file_name}.${newWall.file_ext}`, async (err) => {
                    if (err) {
                        console.error("Error Found: " + err + "\n\n");
                        await TgBot.api.sendMessage(
                        -1001731686694,
                            `<b>Error</b> - \n\n<b>Wallpaper</b> - ${newWall.file_name} added to database.\n\n<b>Object id</b> - ${newWall._id} (for reference).\n\n Added by${newWall.addedBy}.\n\nHowever Wall did not save in storage, because of \n\n${err}`, { message_thread_id: 77299, parse_mode: 'HTML' }
                        );
                        }
                });
            
                fs.rename(thumbnailTg.file_path, `/home/paraskcd/United-Walls-Bot/storage/wallpapers/${categoryName}/thumbnails/${newWall.file_name}.${newWall.file_ext}`, async (err) => {
                    if (err) {
                    console.error("Error Found:", err);
                    await TgBot.api.sendMessage(
                        -1001731686694,
                        `<b>Error</b> - \n\n<b>Existing category</b> - ${categoryName}.\n\n<b>Wallpaper</b> - ${newWall.file_name} added to database.\n\n<b>Object id</b> - ${newWall._id} (for reference).\n\n Added by${newWall.addedBy}.\n\nHowever Thumbnail did not save in storage, because of \n\n${err}.`, { message_thread_id: 77299, parse_mode: 'HTML' }
                    );
                    }
                });

                fs.stat(`./storage/wallpapers/temp/${categoryName}/${newWall.file_name}.${newWall.file_ext}`, function (err, stats) {
                    if (err) {
                        return console.error(err);
                    }
                
                    fs.unlink(`./storage/wallpapers/temp/${categoryName}/${newWall.file_name}.${newWall.file_ext}`,function(err){
                        if(err) return console.log(err);
                        console.log(`${file.filename.split('.')[0]}.${file.filename.split('.')[1]} file deleted successfully from temp folder`);
                    });  
                });

                await Walls.findByIdAndUpdate(newWall.id, { file_url: `https://unitedwalls.paraskcd.com/image/${categoryName}/${newWall.file_name}.${newWall.file_ext}`, thumbnail_url: `https://unitedwalls.paraskcd.com/image/${categoryName}/thumbnails/${newWall.file_name}.${newWall.file_ext}` });

                await TgBot.api.sendDocument(-1001437820361, newWall.file_id, { message_thread_id: "185847", caption: `${newWall.file_name} uploaded by ${newWall.addedBy}` });

                return res.sendStatus(204);
            } else {
                const deletedWall = await Walls.findByIdAndDelete(req.query.wallId);
                console.log("deletedwall", deletedWall);
                let category = await Category.findByIdAndUpdate(deletedWall.category, {
                    $pull: { walls: deletedWall.id }
                });   
                await Uploader.findByIdAndUpdate(deletedWall.creator, {
                    $pull: { walls: deletedWall.id }
                });
                category = await Category.findById(deletedWall.category);
                if (category.walls.length == 0) {
                    await Category.findByIdAndDelete(deletedWall.category);
                }

                fs.stat(`./storage/wallpapers/${category.name.replace(/\s/g, '').trim()}/${deletedWall.file_name}.${deletedWall.file_ext}`, function (err, stats) {
                    if (err) {
                        return console.error(err);
                    }
                
                    fs.unlink(`./storage/wallpapers/${category.name.replace(/\s/g, '').trim()}/${deletedWall.file_name}.${deletedWall.file_ext}`,function(err){
                        if(err) return console.log(err);
                        console.log(`${category.name.replace(/\s/g, '').trim()}/${deletedWall.file_name}.${deletedWall.file_ext} file deleted successfully from temp folder`);
                    });  
                });

                fs.stat(`./storage/wallpapers/${category.name.replace(/\s/g, '').trim()}/thumbnails/${deletedWall.file_name}.${deletedWall.file_ext}`, function (err, stats) {
                    if (err) {
                        return console.error(err);
                    }
                
                    fs.unlink(`./storage/wallpapers/${category.name.replace(/\s/g, '').trim()}/thumbnails/${deletedWall.file_name}.${deletedWall.file_ext}`,function(err){
                        if(err) return console.log(err);
                        console.log(`${category.name.replace(/\s/g, '').trim()}/${deletedWall.file_name}.${deletedWall.file_ext} file deleted successfully from temp folder`);
                    });  
                });
                return res.status(404).send("File not stored properly, I've deleted the wall please ask user to upload again.")
            }
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

module.exports = router;
