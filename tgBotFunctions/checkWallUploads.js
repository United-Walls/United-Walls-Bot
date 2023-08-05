const Category = require('../models/Category');
const Walls = require('../models/Walls');
const Uploaders = require('../models/Uploader');
var fs = require('fs');
const Uploader = require('../models/Uploader');
const { InlineKeyboard } = require('grammy');
const TempWalls = require('../models/TempWalls');
const unauthorized = require('./unauthorized');

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
					const replyMessage = await ctx.reply(
						`Error: Hey, @${msg.from.username ? msg.from.username + ", " : ""}, Did you check the Size of this file?\n\nLike dude are you blind or something?\n\nThe limit is not more than 5MB, if it is more than this I wont allow your shitty Huge file dude! Now Fuck off!`, { message_thread_id: 185847 }
					);
					setTimeout(async () => {
						await ctx.api.deleteMessage(replyMessage.chat.id, replyMessage.message_id);	
					}, 5000);
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
							const replyMessage = await ctx.reply(
								`Error: Hey, @${msg.from.username ? msg.from.username + ", " : ""}, No ID for file could be fetched, can not save to database.\n\nIt seems like you suck at uploading wallpapers, which is weird because it should be easy to do.`, { message_thread_id: 185847 }
							);
							setTimeout(async () => {
								await ctx.api.deleteMessage(replyMessage.chat.id, replyMessage.message_id);	
							}, 5000);
							return;
						}

						if (msg.document?.file_name.match(fileNameRegexp) == null) {
							console.error('Invalid File name');
							const replyMessage = await ctx.reply(
								`Error: Hey, @${ msg.from.username ? msg.from.username + ", " : "" }, Your shitty file name ${msg.document?.file_name.bold()}, is invalid, it should be like SomeName_12345.ext.\n\nIt's no rocket science, I don't know if your parents taught you simple ABCD, but like c'mon, you really suck at this`, { message_thread_id: 185847, parse_mode: 'HTML' }
							);
							setTimeout(async () => {
								await ctx.api.deleteMessage(replyMessage.chat.id, replyMessage.message_id);	
							}, 10000);
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

									const upl = await Uploader.findOne({userID: msg.from.id});

									if (
										msg.from.id === 975024565
										|| msg.from.id === 934949695
										|| msg.from.id === 1889905927 
										|| msg.from.id === 127070302
									) {
										const newWall = await Walls.create({
											file_name: msg.document?.file_name.split('.')[0],
											file_id: msg.document?.file_id,
											thumbnail_id: msg.document?.thumbnail.file_id,
											file_url: `https://unitedwalls.paraskcd.com/image/${msg.document?.file_name.split('.')[0].split('_')[0].replace(/([A-Z])/g, ' $1').trim().replace(/\s/g, '')}/${msg.document?.file_name.split('.')[0]}.${msg.document?.mime_type == "image/jpeg" ? "jpg" : "png"}`,
											thumbnail_url: `https://unitedwalls.paraskcd.com/image/${msg.document?.file_name.split('.')[0].split('_')[0].replace(/([A-Z])/g, ' $1').trim().replace(/\s/g, '')}/thumbnails/${msg.document?.file_name.split('.')[0]}.${msg.document?.mime_type == "image/jpeg" ? "jpg" : "png"}`,
											mime_type: msg.document?.mime_type,
											category: newCategory._id,
											addedBy: msg.from.username,
											creator: upl,
											file_ext: `${msg.document?.mime_type == "image/jpeg" ? "jpg" : "png"}`,
											hidden: false
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
													`<b>New category</b> - ${newCategory.name} created and added to the database.\n\n<b>Wallpaper</b> - ${newWall.file_name} added to database.\n\n<b>Object id</b> - ${newWall._id} (for reference).\n\n<b>Added by</b> - ${msg.from.username}.\n\nWallpaper saved in storage as well.`, { message_thread_id: 77299, parse_mode: 'HTML' }
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
									} else {
										const newWall = await Walls.create({
											file_name: `${msg.document?.file_name.split('.')[0]}`,
											file_id: msg.document?.file_id,
											thumbnail_id: msg.document?.thumbnail.file_id,
											file_url: "",
											thumbnail_url: "",
											mime_type: msg.document?.mime_type,
											category: newCategory._id,
											addedBy: msg.from.username,
											hidden: true,
											file_ext: `${msg.document?.mime_type == "image/jpeg" ? "jpg" : "png"}`,
											creator: upl
										});

										const inlineKeyboard = new InlineKeyboard()
											.text('Approve', `A_${newWall.id}`)
											.row()
											.text('Deny', `D_${newWall.id}`);

										const message = await bot.api.sendDocument(-1001731686694, msg.document?.file_id, { message_thread_id: 82113, reply_markup: inlineKeyboard, caption: `Creator: ${msg.from.username}\n\nUploaded a wallpaper in the database.\n\nApprove or deny?` });

										const tempWall = await TempWalls.findOneAndUpdate({ wall: newWall }, { wall: newWall, messageID: message.message_id }, { upsert: true, new: true, setDefaultsOnInsert: true });

										await bot.api.deleteMessage(msg.chat.id, msg.message_id);

										const replyMessage = await ctx.reply(
											`Hey, @${msg.from.username ? msg.from.username + ", " : ""}Your wallpaper has gone for Approval. Once approved, you'll be able to see your Wallpaper here. If you have any questions, ask the admins.`, { message_thread_id: 185847, parse_mode: 'HTML' }
										);
										setTimeout(async () => {
											await ctx.api.deleteMessage(replyMessage.chat.id, replyMessage.message_id);	
										}, 10000);
										return;
									}
								}
							});
							return;
						} else {
							const upl = await Uploader.findOne({userID: msg.from.id});

							if (
								msg.from.id === 975024565
								|| msg.from.id === 934949695
								|| msg.from.id === 1889905927 
								|| msg.from.id === 127070302
							) {
								const newWall = await Walls.create({
									file_name: msg.document?.file_name.split('.')[0],
									file_id: msg.document?.file_id,
									thumbnail_id: msg.document?.thumbnail.file_id,
									file_url: `https://unitedwalls.paraskcd.com/image/${msg.document?.file_name.split('.')[0].split('_')[0].replace(/([A-Z])/g, ' $1').trim().replace(/\s/g, '')}/${msg.document?.file_name.split('.')[0]}.${msg.document?.mime_type == "image/jpeg" ? "jpg" : "png"}`,
									thumbnail_url: `https://unitedwalls.paraskcd.com/image/${msg.document?.file_name.split('.')[0].split('_')[0].replace(/([A-Z])/g, ' $1').trim().replace(/\s/g, '')}/thumbnails/${msg.document?.file_name.split('.')[0]}.${msg.document?.mime_type == "image/jpeg" ? "jpg" : "png"}`,
									mime_type: msg.document?.mime_type,
									category: category._id,
									addedBy: msg.from.username,
									creator: upl,
									file_ext: `${msg.document?.mime_type == "image/jpeg" ? "jpg" : "png"}`,
									hidden: false
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
													`<b>Existing category</b> - ${category.name}.\n\n<b>Wallpaper</b> - ${newWall.file_name} added to database.\n\n<b>Object id</b> - ${newWall._id} (for reference).\n\n<b>Added by</b> - ${msg.from.username}.\n\nWallpaper saved in storage as well.`, { message_thread_id: 77299, parse_mode: 'HTML' }
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
							} else {
								const newWall = await Walls.create({
									file_name: `${msg.document?.file_name.split('.')[0]}`,
									file_id: msg.document?.file_id,
									thumbnail_id: msg.document?.thumbnail.file_id,
									file_url: "",
									thumbnail_url: "",
									mime_type: msg.document?.mime_type,
									category: category._id,
									addedBy: msg.from.username,
									hidden: true,
									file_ext: `${msg.document?.mime_type == "image/jpeg" ? "jpg" : "png"}`,
									creator: upl
								});

								const inlineKeyboard = new InlineKeyboard()
									.text('Approve', `A_${newWall.id}`)
									.row()
									.text('Deny', `D_${newWall.id}`);

								const message = await bot.api.sendDocument(-1001731686694, msg.document?.file_id, { message_thread_id: 82113, reply_markup: inlineKeyboard, caption: `Creator: ${msg.from.username}\n\nUploaded a wallpaper in the database.\n\nApprove or deny?` });

								const tempWall = await TempWalls.findOneAndUpdate({ wall: newWall }, { wall: newWall, messageID: message.message_id }, { upsert: true, new: true, setDefaultsOnInsert: true });

								await bot.api.deleteMessage(msg.chat.id, msg.message_id);
							}
							return;
						}
					} else {
						const replyMessage = await ctx.reply(
							`Error: Hey, @${msg.from.username ? msg.from.username + ", " : ""}, a wallpaper with the same name - ${wall.file_name} whose database document Object ID is ${wall._id} (for reference), is already added to the database.\n\nPlease have some common sense, don't be an idiot and change the name or make sure it's not already added in the Database.`, { message_thread_id: 185847 }
						);
						setTimeout(async () => {
							await ctx.api.deleteMessage(replyMessage.chat.id, replyMessage.message_id);	
						}, 5000);
						return;
					}
				} catch (error) {
					console.error(error.message);
					const replyMessage = await ctx.reply(
						`Error: Hey, @${msg.from.username ? msg.from.username + ", " : ""}, could not save to Database.\n\nYou've become the greatest and the worst person to do this job, that's saying something!`, { message_thread_id: 185847 }
					);
					setTimeout(async () => {
						await ctx.api.deleteMessage(replyMessage.chat.id, replyMessage.message_id);	
					}, 5000);
					return;
				}
			}
		}
};

module.exports = checkWallUploads;
