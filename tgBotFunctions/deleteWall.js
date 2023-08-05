const Category = require('../models/Category');
const Uploader = require('../models/Uploader');
const Walls = require('../models/Walls');
const fs = require('fs');

const deleteWall = async (ctx, wallId, messageToUpdate) => {
	const deletedWall = await Walls.findByIdAndDelete(wallId);
	const category = await Category.findByIdAndUpdate(deletedWall.category, {
		$pull: { walls: deletedWall.id }
	});
	await Uploader.findByIdAndUpdate(deletedWall.creator, {
		$pull: { walls: deletedWall.id }
	});

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
	
	await ctx.api.editMessageText(messageToUpdate.message.chatId, messageToUpdate.message.id, "Wallpaper - " + deletedWall.file_name + " deleted successfully.", { reply_markup: {}, message_thread_id: messageToUpdate.message.message_thread_id });
};

module.exports = deleteWall;
