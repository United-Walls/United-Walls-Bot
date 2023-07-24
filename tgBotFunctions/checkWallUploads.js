const Category = require('../models/Category');
const Walls = require('../models/Walls');
const Uploaders = require('../models/Uploader');
var fs = require('fs');
const Uploader = require('../models/Uploader');

const checkWallUploads = async (msg, bot, ctx) => {
	
	if (
		'document' in msg &&
		(msg.document?.mime_type == 'image/png' ||
			msg.document?.mime_type == 'image/jpg' ||
			msg.document?.mime_type == 'image/jpeg') &&
		msg.is_topic_message &&
		msg.message_thread_id &&
		msg.message_thread_id == 185847
		) {
			let uploader = await Uploaders.find({userID: msg.from.id});

			if (uploader.length > 0) {
				if (msg.document?.file_size > 5242880) {
					console.error('File is more than 5MB!');
					await ctx.reply(
						`Error: Hey, @${msg.from.username}, Did you check the Size of this file?\n\nLike dude are you blind or something?\n\nThe limit is not more than 5MB, if it is more than this I wont allow your shitty Huge file dude! Now Fuck off!`
					);
					return;
				}
				try {
					const fileNameRegexp = /[A-Z][a-z].*_[0-9]+.*[A-Za-z]+/;

					let wall = await Walls.findOne({
						file_name: msg.document?.file_name.split('.')[0],
					});

					let category = await Category.findOne({
						name: msg.document?.file_name
							.split('.')[0]
							.split('_')[0]
							.replace(/([A-Z])/g, ' $1')
							.trim(),
					});

					if (!wall) {
						if (!msg.document?.file_id) {
							console.error("File doesn't have an id!");
							await ctx.reply(
								`Error: Hey, @${msg.from.username}, No ID for file could be fetched, can not save to database.\n\nIt seems like you suck at uploading wallpapers, which is weird because it should be easy to do.`
							);
							return;
						}

						if (msg.document?.file_name.match(fileNameRegexp) == null) {
							console.error('Invalid File name');
							await ctx.reply(
								`Error: Hey, @${ msg.from.username }, Your shitty file name ${msg.document?.file_name.bold()}, is invalid, it should be like SomeName_12345.ext.\n\nIt's no rocket science, I don't know if your parents taught you simple ABCD, but like c'mon, you really suck at this`
							);
							return;
						}

						let file = await ctx.api.getFile(msg.document?.file_id);
						let thumbnail = await ctx.api.getFile(msg.document?.thumbnail.file_id);

						if (!category) {
							fs.mkdir(`/home/paraskcd/United-Walls-Bot/storage/wallpapers/${msg.document?.file_name.split('.')[0].split('_')[0].replace(/([A-Z])/g, ' $1').trim().replace(/\s/g, '')}/thumbnails`, { recursive: true }, async (err) => {
								if(err) {
									//note: this does NOT get triggered if the directory already existed
									console.warn(err)
								}
								else{
									let newCategory = await Category.create({
										name: msg.document?.file_name
											.split('.')[0]
											.split('_')[0]
											.replace(/([A-Z])/g, ' $1')
											.trim(),
									});
				
									const newWall = await Walls.create({
										file_name: msg.document?.file_name.split('.')[0],
										file_id: msg.document?.file_id,
										thumbnail_id: msg.document?.thumbnail.file_id,
										file_url: `http://unitedwalls.paraskcd.com/image/${msg.document?.file_name.split('.')[0].split('_')[0].replace(/([A-Z])/g, ' $1').trim().replace(/\s/g, '')}/${msg.document?.file_name.split('.')[0]}.${msg.document?.mime_type == "image/jpeg" ? "jpg" : "png"}`,
										thumbnail_url: `http://unitedwalls.paraskcd.com/image/${msg.document?.file_name.split('.')[0].split('_')[0].replace(/([A-Z])/g, ' $1').trim().replace(/\s/g, '')}/thumbnails/${msg.document?.file_name.split('.')[0]}.${msg.document?.mime_type == "image/jpeg" ? "jpg" : "png"}`,
										mime_type: msg.document?.mime_type,
										category: newCategory._id,
										addedBy: msg.from.username
									});
				
									await Category.findByIdAndUpdate(newCategory._id, {
										$push: { walls: newWall },
									});

									await Uploader.findOneAndUpdate({ username: msg.from.username }, {
										$push: { walls: newWall },
									});
									
									fs.rename(file.file_path, `/home/paraskcd/United-Walls-Bot/storage/wallpapers/${msg.document?.file_name.split('.')[0].split('_')[0].replace(/([A-Z])/g, ' $1').trim().replace(/\s/g, '')}/${msg.document?.file_name.split('.')[0]}.${msg.document?.mime_type == "image/jpeg" ? "jpg" : "png"}`, async (err) => {
										if (err) {
										console.error("Error Found: " + err + "\n\n");
										await bot.api.sendMessage(
											-1001731686694,
												`<b>Error</b> - \n\n<b>New category</b> - ${newCategory.name} created and added to the database.\n\n<b>Wallpaper</b> - ${newWall.file_name} added to database.\n\n<b>Object id</b> - ${newWall._id} (for reference).\n\n<b>Added by</b> - ${msg.from.username}.\n\nHowever Wall did not save in storage, because of \n\n${err}`, { message_thread_id: 77299, parse_mode: 'HTML' }
											);
										} else {
											await bot.api.sendMessage(
												-1001731686694,
												`<b>New category</b> - ${newCategory.name} created and added to the database.\n\n<b>Wallpaper</b> - ${newWall.file_name} added to database.\n\n<b>Object id</b> - ${newWall._id} (for reference).\n\n<b>Added by</b> - ${msg.from.username}.\n\nWallpaper saved in storage as well\n\n.`, { message_thread_id: 77299, parse_mode: 'HTML' }
											);
										}
									});
					
									fs.rename(thumbnail.file_path, `/home/paraskcd/United-Walls-Bot/storage/wallpapers/${msg.document?.file_name.split('.')[0].split('_')[0].replace(/([A-Z])/g, ' $1').trim().replace(/\s/g, '')}/thumbnails/${msg.document?.file_name.split('.')[0]}.${msg.document?.mime_type == "image/jpeg" ? "jpg" : "png"}`, async (err) => {
										if (err) {
										console.error("Error Found: " + err + "\n\n");
										await bot.api.sendMessage(
											-1001731686694,
												`<b>Error</b> - \n\n<b>New category</b> - ${newCategory.name} created and added to the database.\n\n<b>Wallpaper</b> - ${newWall.file_name} added to database.\n\n<b>Object id</b> - ${newWall._id} (for reference).\n\n<b>Added by</b> - ${msg.from.username}.\n\nHowever Thumbnail did not save in storage, because of \n\n${err}`, { message_thread_id: 77299, parse_mode: 'HTML' }
											);
										} else {
											await bot.api.sendMessage(
												-1001731686694,
												`Thumbnail also saved in storage as well.`, {message_thread_id: 77299}
											);
										}
									});
								}
							});
							return;
						} else {
							const newWall = await Walls.create({
								file_name: msg.document?.file_name.split('.')[0],
								file_id: msg.document?.file_id,
								thumbnail_id: msg.document?.thumbnail.file_id,
								file_url: `http://unitedwalls.paraskcd.com/image/${msg.document?.file_name.split('.')[0].split('_')[0].replace(/([A-Z])/g, ' $1').trim().replace(/\s/g, '')}/${msg.document?.file_name.split('.')[0]}.${msg.document?.mime_type == "image/jpeg" ? "jpg" : "png"}`,
								thumbnail_url: `http://unitedwalls.paraskcd.com/image/${msg.document?.file_name.split('.')[0].split('_')[0].replace(/([A-Z])/g, ' $1').trim().replace(/\s/g, '')}/thumbnails/${msg.document?.file_name.split('.')[0]}.${msg.document?.mime_type == "image/jpeg" ? "jpg" : "png"}`,
								mime_type: msg.document?.mime_type,
								category: category._id,
								addedBy: msg.from.username
							});

							await Category.findByIdAndUpdate(category._id, {
								$push: { walls: newWall },
							});

							await Uploader.findOneAndUpdate({ username: msg.from.username }, {
								$push: { walls: newWall },
							});

							fs.rename(file.file_path, `/home/paraskcd/United-Walls-Bot/storage/wallpapers/${msg.document?.file_name.split('.')[0].split('_')[0].replace(/([A-Z])/g, ' $1').trim().replace(/\s/g, '')}/${msg.document?.file_name.split('.')[0]}.${msg.document?.mime_type == "image/jpeg" ? "jpg" : "png"}`, async (err) => {
								if (err) {
										console.error("Error Found: " + err + "\n\n");
										await bot.api.sendMessage(
											-1001731686694,
												`<b>Error</b> - \n\n<b>Wallpaper</b> - ${newWall.file_name} added to database.\n\n<b>Object id</b> - ${newWall._id} (for reference).\n\n<b>Added by</b> - ${msg.from.username}.\n\nHowever Wall did not save in storage, because of \n\n${err}`, { message_thread_id: 77299, parse_mode: 'HTML' }
											);
										} else {
											await bot.api.sendMessage(
												-1001731686694,
												`<b>Existing category</b> - ${category.name}.\n\n<b>Wallpaper</b> - ${newWall.file_name} added to database.\n\n<b>Object id</b> - ${newWall._id} (for reference).\n\n<b>Added by</b> - ${msg.from.username}.\n\nWallpaper saved in storage as well\n\n.`, { message_thread_id: 77299, parse_mode: 'HTML' }
											);
										}
							});
			
							fs.rename(thumbnail.file_path, `/home/paraskcd/United-Walls-Bot/storage/wallpapers/${msg.document?.file_name.split('.')[0].split('_')[0].replace(/([A-Z])/g, ' $1').trim().replace(/\s/g, '')}/thumbnails/${msg.document?.file_name.split('.')[0]}.${msg.document?.mime_type == "image/jpeg" ? "jpg" : "png"}`, async (err) => {
								if (err) {
								console.error("Error Found:", err);
								await bot.api.sendMessage(
										-1001731686694,
										`<b>Error</b> - \n\n<b>Existing category</b> - ${category.name}.\n\n<b>Wallpaper</b> - ${newWall.file_name} added to database.\n\n<b>Object id</b> - ${newWall._id} (for reference).\n\n<b>Added by</b> - ${msg.from.username}.\n\nHowever Thumbnail did not save in storage, because of \n\n${err}.`, { message_thread_id: 77299, parse_mode: 'HTML' }
									);
								} else {
									await bot.api.sendMessage(
										-1001731686694,
										`Thumbnail also saved in storage as well.`, { message_thread_id: 77299 }
									);
								}
							});
							
							return;
						}
					} else {
						await ctx.reply(
							`Error: Hey, @${msg.from.username}, a wallpaper with the same name - ${wall.file_name} whose database document Object ID is ${wall._id} (for reference), is already added to the database.\n\nPlease have some common sense, don't be an idiot and change the name or make sure it's not already added in the Database.`,
						);
						return;
					}
				} catch (error) {
					console.error(error.message);
					await ctx.reply(
						`Error: Hey, @${msg.from.username}, could not save to Database.\n\nYou've become the greatest and the worst person to do this job, that's saying something!`,
					);
					return;
				}
		}
	}
};

module.exports = checkWallUploads;
