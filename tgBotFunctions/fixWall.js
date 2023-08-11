const Category = require("../models/Category");
const Uploader = require("../models/Uploader");
const Walls = require("../models/Walls");
const fs = require('fs');

module.exports = async (ctx, wallId, messageToUpdate) => {
    const newWall = await Walls.findById(wallId).populate('category');
    const categoryName = newWall.category.name.replace(/\s/g, "").trim();

    if (newWall.file_id != "" && newWall.thumbnail_id != "") {
        let fileTg = await ctx.api.getFile(newWall.file_id);
        let thumbnailTg = await ctx.api.getFile(newWall.thumbnail_id);

        fs.rename(fileTg.file_path, `/home/paraskcd/United-Walls-Bot/storage/wallpapers/${categoryName}/${newWall.file_name}.${newWall.file_ext}`, async (err) => {
            if (err) {
                console.error("Error Found: " + err + "\n\n");
                await ctx.api.sendMessage(
                -1001731686694,
                    `<b>Error</b> - \n\n<b>Wallpaper</b> - ${newWall.file_name} added to database.\n\n<b>Object id</b> - ${newWall._id} (for reference).\n\n Added by${newWall.addedBy}.\n\nHowever Wall did not save in storage, because of \n\n${err}`, { message_thread_id: 77299, parse_mode: 'HTML' }
                );
                }
        });
    
        fs.rename(thumbnailTg.file_path, `/home/paraskcd/United-Walls-Bot/storage/wallpapers/${categoryName}/thumbnails/${newWall.file_name}.${newWall.file_ext}`, async (err) => {
            if (err) {
            console.error("Error Found:", err);
            await ctx.api.sendMessage(
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

        await ctx.api.sendDocument(-1001437820361, newWall.file_id, { message_thread_id: "185847", caption: `${newWall.file_name} uploaded by ${newWall.addedBy}` });

        await ctx.api.editMessageText(messageToUpdate.message.chatId, messageToUpdate.message.id, "Fixed Successfully", { reply_markup: {}, message_thread_id: messageToUpdate.message.message_thread_id});
    } else {
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

        await ctx.api.editMessageText(messageToUpdate.message.chatId, messageToUpdate.message.id, "Wall could not be uploaded successfully, that is why I've deleted the wall instead. Please ask the creator to upload again.", { reply_markup: {}, message_thread_id: messageToUpdate.message.message_thread_id});
    }
}