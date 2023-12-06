const { Bot, InlineKeyboard, GrammyError, HttpError } = require('grammy');
const fs = require('fs');
require('dotenv').config();
// Create new instance of Bot class, pass your token in the Bot constructor.
const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN, {
	client: {
		apiRoot: process.env.TELEGRAM_API
	}
});
const start = require('./bot/start')
const unauthorized = require('./tgBotFunctions/unauthorized');
const deleteMessage = require('./tgBotFunctions/delete');
const categoryWallsMenu = require('./tgBotFunctions/categoryWallsMenu');
const wallMenu = require('./tgBotFunctions/wallMenu');
const checkWallUploads = require('./tgBotFunctions/checkWallUploads');
const editWallName = require('./tgBotFunctions/editWallName');
const deleteWall = require('./tgBotFunctions/deleteWall');
const editCategoryMenu = require('./tgBotFunctions/editCategoryMenu');
const changeCategory = require('./tgBotFunctions/changeCategory');
const Uploader = require('./models/Uploader');
const userMenuMethod = require('./tgBotFunctions/userMenu');
const updateUserMethod = require('./tgBotFunctions/updateUser');
const editUserMenuMethod = require('./tgBotFunctions/editUserMenu');
const editUploaderUsernameMethod = require('./tgBotFunctions/editUploaderUsername');
const removeUploaderPfpMethod = require('./tgBotFunctions/removeUploaderPfp');
const deleteUserMethod = require('./tgBotFunctions/deleteUser');
const uploaderWallsMenu = require('./tgBotFunctions/uploaderWallsMenu');
const addAvatarMethod = require('./tgBotFunctions/addAvatar');
const Invite = require('./models/Invite');
const registerMethod = require('./tgBotFunctions/registerMethod');
const generateInvitationsMethod = require('./tgBotFunctions/generateInvitations');
const ChatIDs = require('./models/ChatIDS');
const Walls = require('./models/Walls');
const Category = require('./models/Category');
const TempWalls = require('./models/TempWalls');
const menu = require('./bot/menu');
const editPayload = require('./bot/editPayload');
const editUserPayload = require('./bot/editUserPayload');
const register = require('./bot/register');
const fixWall = require('./tgBotFunctions/fixWall');

let editName = [];
let addUploader = [];
let addUploaderID = [];
let editUploaderName = [];
let addAvatar = [];
let registers = [];
let invitation = [];
let generateInvitations = []
let denyWall = [];
let updateMessage = [];
let userId = '';
let wallId = '';

// Register listeners below
// Handle /start command
bot.command('start', start);

bot.command('register', async (ctx) => {
	const message = await register(ctx);

	if (message) {
		updateMessage.push({ userId: ctx.message.from.id, message: { id: message.message_id, chatId: message.chat.id, message_thread_id: message.message_thread_id }});
		console.log(updateMessage);
	}
});

bot.callbackQuery('register-user', async (ctx) => {
	if (updateMessage.filter(msg => msg.userId === ctx.callbackQuery.from.id).length > 0) {
		const messageToUpdate = updateMessage.filter(msg => msg.userId === ctx.callbackQuery.from.id)[0];
		registers.push(ctx.callbackQuery.from.id);
		console.log("Register Array - ", registers);
		let editKeyboard = {
			inline_keyboard: [
				[{ text: 'Cancel', callback_data: 'exit-payload' }],
			],
		};
		await ctx.api.editMessageText(messageToUpdate.message.chatId, messageToUpdate.message.id, 'Please enter a password. Should be more than 5 digits, should have alpha-numeric characters, etc. You know the drill.', { reply_markup: editKeyboard, message_thread_id: messageToUpdate.message.message_thread_id });		
	}
});

bot.callbackQuery('invitation-code', async (ctx) => {
	if (updateMessage.filter(msg => msg.userId === ctx.callbackQuery.from.id).length > 0) {
		const messageToUpdate = updateMessage.filter(msg => msg.userId === ctx.callbackQuery.from.id)[0];
		invitation.push(ctx.callbackQuery.from.id);
		console.log("Invitation Array - ", invitation);
		let editKeyboard = {
			inline_keyboard: [
				[{ text: 'Cancel', callback_data: 'exit-payload' }],
			],
		};
		await ctx.api.editMessageText(messageToUpdate.message.chatId, messageToUpdate.message.id, 'Please enter the Invitation Code.', { reply_markup: editKeyboard, message_thread_id: messageToUpdate.message.message_thread_id });
	}
});

bot.command('menu', async (ctx) => {
	const message = await menu(ctx);
	updateMessage.push({ userId: ctx.message.from.id, message: { id: message.message_id, chatId: message.chat.id, message_thread_id: message.message_thread_id }});
	console.log(updateMessage);
});

bot.callbackQuery('generated-invitations', async (ctx) => {
	const uploader = await Uploader.findOne({userID: ctx.callbackQuery.from.id});
	const invites = await Invite.find({ uploader: uploader });
	let string = "";
	const currentDate = new Date;
	if (
		ctx.callbackQuery.from.id == 975024565 ||
		ctx.callbackQuery.from.id == 934949695 ||
		ctx.callbackQuery.from.id == 1889905927 ||
		ctx.callbackQuery.from.id == 127070302
	) {
		if(updateMessage.filter(msg => msg.userId === ctx.callbackQuery.from.id).length > 0) {
			const messageToUpdate = updateMessage.filter(msg => msg.userId === ctx.callbackQuery.from.id)[0];
			
			if (invites.length > 0) {
				for(let i = 0; i < invites.length; i++) {
					if (invites[i].expiry > currentDate && invites[i].used === false) {
						string += `Invite Code - ${invites[i].token}  |||  Expiry - ${invites[i].expiry.toLocaleString()}\n\n`;
					}
				}
	
				await ctx.api.editMessageText(messageToUpdate.message.chatId, messageToUpdate.message.id, string, { reply_markup: {}, message_thread_id: messageToUpdate.message.message_thread_id });

				updateMessage = updateMessage.filter((fil) => fil.userId !== ctx.callbackQuery.from.id);
				console.log(updateMessage);
				return;
			} else {
				const message = await ctx.reply("You haven't generated any invite codes, or they have expired, or they have been used.");
	
				setTimeout(async () => {
					await ctx.api.deleteMessage(message.chat.id, message.message_id);
				}, 3000);
			}
		}
	} else {
		updateMessage = updateMessage.filter(msg => msg.userId === ctx.callbackQuery.from.id);
		console.log(updateMessage);
		return;
	}
})

bot.callbackQuery('generate-invitations', async (ctx) => {
	if (
		ctx.callbackQuery.from.id == 975024565 ||
		ctx.callbackQuery.from.id == 934949695 ||
		ctx.callbackQuery.from.id == 1889905927 ||
		ctx.callbackQuery.from.id == 127070302
	 ) {
		if(updateMessage.filter(msg => msg.userId === ctx.callbackQuery.from.id).length > 0) {
			const messageToUpdate = updateMessage.filter(msg => msg.userId === ctx.callbackQuery.from.id)[0];
			generateInvitations.push(ctx.callbackQuery.from.id);
			
			console.log("Generate Invitations Array", generateInvitations);
	
			let editKeyboard = {
				inline_keyboard: [
					[{ text: 'Cancel', callback_data: 'exit-payload' }],
				],
			}
		
			await ctx.api.editMessageText(messageToUpdate.message.chatId, messageToUpdate.message.id, 'How many Invitation Codes you want to generate? Enter a number', { reply_markup: editKeyboard, message_thread_id: messageToUpdate.message.message_thread_id });

			return;
		}
	} else {
		updateMessage = updateMessage.filter(msg => msg.userId === ctx.callbackQuery.from.id);
		console.log(updateMessage);
		return;
	}
})

bot.callbackQuery('exit-payload', async (ctx) => {
	registers = registers.filter((fil) => { ctx.callbackQuery.from.id != fil });
	invitation = invitation.filter((fil) => { ctx.callbackQuery.from.id != fil });
	addAvatar = addAvatar.filter((fil) => { ctx.callbackQuery.from.id != fil });
	editName = editName.filter((fil) => { ctx.callbackQuery.from.id != fil });
	addUploader = addUploader.filter((fil) => { ctx.callbackQuery.from.id != fil });
	addUploaderID = addUploaderID.filter((fil) => { ctx.callbackQuery.from.id != fil });
	editUploaderName = editUploaderName.filter((fil) => { ctx.callbackQuery.from.id != fil });
	generateInvitations = generateInvitations.filter((fil) => { ctx.callbackQuery.from.id != fil });

	if(updateMessage.filter(msg => msg.userId === ctx.callbackQuery.from.id).length > 0) {
		const messageToUpdate = updateMessage.filter(msg => msg.userId === ctx.callbackQuery.from.id)[0];

		await ctx.api.editMessageText(messageToUpdate.message.chatId, messageToUpdate.message.id, "Ok, BYE!\n\n lol", { reply_markup: {}, message_thread_id: messageToUpdate.message.message_thread_id });

		setTimeout(async () => {
			await ctx.api.deleteMessage(messageToUpdate.message.chatId, messageToUpdate.message.id);
		}, 5000);

		updateMessage = updateMessage.filter((fil) => fil.userId !== ctx.callbackQuery.from.id);
		console.log(updateMessage);
	}

	return;
});

bot.callbackQuery('edit-user-payload', async (ctx) => {
	await editUserPayload(ctx, updateMessage);
});

// Wait for click events with specific callback data.
bot.callbackQuery('edit-payload', async (ctx) => {
	await editPayload(ctx, updateMessage);
});

bot.callbackQuery('go-back-from-edit-payload', async (ctx) => {
	await menu(ctx, updateMessage, true);
});

bot.on('callback_query:data', async (ctx) => {
	const data = ctx.callbackQuery.data;

	if (data.split('_')[0] == 'A') {
		if (
			ctx.callbackQuery.from.id == 975024565 ||
			ctx.callbackQuery.from.id == 934949695 ||
			ctx.callbackQuery.from.id == 1889905927 ||
			ctx.callbackQuery.from.id == 127070302
		) {
			const wallId = data.split('_')[1];
			const wall = await Walls.findById(wallId);
			const category = await Category.findById(wall.category);
			const newWall = await Walls.findByIdAndUpdate(wallId, {
				hidden: false,
				thumbnail_url: `https://unitedwalls.paraskcd.com/image/${category.name.replace(/\s/g, "").trim()}/thumbnails/${wall.file_name}.${wall.file_ext}`,
				file_url: `https://unitedwalls.paraskcd.com/image/${category.name.replace(/\s/g, "").trim()}/${wall.file_name}.${wall.file_ext}`
			});

			await Category.findByIdAndUpdate(category.id, {
				$push: { walls: newWall },
			  });
		  
			await Uploader.findByIdAndUpdate(wall.creator, {
				$push: { walls: newWall },
			});

			const tempWall = await TempWalls.findOneAndDelete({ wall: wall });
			console.log(tempWall);

			await ctx.api.editMessageCaption(-1001731686694, tempWall.messageID, { reply_markup: {}, caption: `Approved by ${ctx.callbackQuery.from.username }` });

			let file = await ctx.api.getFile(wall.file_id);
			let thumbnail = await ctx.api.getFile(wall.thumbnail_id);

			await ctx.api.sendDocument(-1001437820361, wall.file_id, { message_thread_id: "185847", caption: `${wall.file_name} uploaded by ${wall.addedBy}` });

			fs.stat(`./storage/wallpapers/temp/${category.name.replace(/\s/g, "").trim()}/${wall.file_name}.${wall.file_ext}`, function (err, stats) {
				if (err) {
					return console.error(err);
				}
			
				fs.unlink(`./storage/wallpapers/temp/${category.name.replace(/\s/g, "").trim()}/${wall.file_name}.${wall.file_ext}`,function(err){
					if(err) return console.log(err);
					console.log(`${wall.file_name}.${wall.file_ext} file deleted successfully from temp folder`);
				});  
			  });

			fs.rename(file.file_path, `/home/paraskcd/United-Walls-Bot/storage/wallpapers/${category.name.replace(/\s/g, "").trim()}/${wall.file_name}.${wall.file_ext}`, async (err) => {
				if (err) {
					console.error("Error Found: " + err + "\n\n");
				} else {
					console.log("saved")
				}
			});

			fs.rename(thumbnail.file_path, `/home/paraskcd/United-Walls-Bot/storage/wallpapers/${category.name.replace(/\s/g, "").trim()}/thumbnails/${wall.file_name}.${wall.file_ext}`, async (err) => {
				if (err) {
					console.error("Error Found:", err);
				} else {
					console.log("saved thumbnail too")
				}
			});

			return;
		}
	}

	if (data.split('_')[0] == 'D') {
		if (
			ctx.callbackQuery.from.id == 975024565 ||
			ctx.callbackQuery.from.id == 934949695 ||
			ctx.callbackQuery.from.id == 1889905927 ||
			ctx.callbackQuery.from.id == 127070302
		) {
			wallId = data.split('_')[1];
			const wall = await Walls.findById(data.split('_')[1]);
			const tempWall = await TempWalls.findOne({ wall });
			denyWall.push(ctx.callbackQuery.from.id);
			const editKeyboard = {
				inline_keyboard: [
					[{ text: 'Cancel', callback_data: `C_${data.split('_')[1]}` }],
				],
			}
			await ctx.api.editMessageCaption(-1001731686694, tempWall.messageID, { reply_markup: editKeyboard, caption: `Please write reason for Deny. This Reason will be sent to the uploader` });
		}
	}

	if (data.split('_')[0] == 'C') {
		if (
			ctx.callbackQuery.from.id == 975024565 ||
			ctx.callbackQuery.from.id == 934949695 ||
			ctx.callbackQuery.from.id == 1889905927 ||
			ctx.callbackQuery.from.id == 127070302
		) {
			wallId = data.split('_')[1];
			const wall = await Walls.findById(data.split('_')[1]);
			const tempWall = await TempWalls.findOne({ wall });
			denyWall = denyWall.filter(ids => ids != ctx.callbackQuery.from.id);
			const inlineKeyboard = new InlineKeyboard()
									.text('Approve', `A_${data.split('_')[1]}`)
									.row()
									.text('Deny', `D_${data.split('_')[1]}`); 
			await ctx.api.editMessageCaption(-1001731686694, tempWall.messageID, { reply_markup: inlineKeyboard, caption: `Creator: ${wall.addedBy}\n\nUploaded a wallpaper in the database.\n\nApprove or deny?` });
		}
	}

	if (data.split('_')[0] == 'Cat') {
		if (
			ctx.callbackQuery.from.id == 975024565 ||
			ctx.callbackQuery.from.id == 934949695 ||
			ctx.callbackQuery.from.id == 1889905927 ||
			ctx.callbackQuery.from.id == 127070302
		) {
			if (updateMessage.filter(msg => msg.userId === ctx.callbackQuery.from.id).length > 0) {
				const messageToUpdate = updateMessage.filter(msg => msg.userId === ctx.callbackQuery.from.id)[0];
				await categoryWallsMenu(ctx, messageToUpdate, data);
			}
		}
	}

	if (data.split('_')[0] == 'Wal') {
		let uploader = await Uploader.find({userID: ctx.callbackQuery.from.id});

		if (
			uploader.length > 0
		) {
			if (updateMessage.filter(msg => msg.userId === ctx.callbackQuery.from.id).length > 0) {
				const messageToUpdate = updateMessage.filter(msg => msg.userId === ctx.callbackQuery.from.id)[0];
				await ctx.api.deleteMessage(messageToUpdate.message.chatId, messageToUpdate.message.id);
				const message = await wallMenu(ctx, messageToUpdate, data);
				updateMessage = updateMessage.filter((fil) => fil.userId !== messageToUpdate.userId);
				updateMessage.push({ userId: messageToUpdate.userId, message: { id: message.message_id, chatId: message.chat.id, message_thread_id: message.message_thread_id }});
				console.log(updateMessage);
			}
		}
	}

	if (data.split('_')[0] == 'EdN') {
		let uploader = await Uploader.find({userID: ctx.callbackQuery.from.id});

		if (
			uploader.length > 0
		) {
			if (updateMessage.filter(msg => msg.userId === ctx.callbackQuery.from.id).length > 0) {
				const messageToUpdate = updateMessage.filter(msg => msg.userId === ctx.callbackQuery.from.id)[0];
				editName.push(ctx.callbackQuery.from.id);
				console.log("Edit Name Array - ", editName);
				wallId = data.split('_')[1];
				let editKeyboard = {
					inline_keyboard: [
						[{ text: 'Go back', callback_data: `Wal_${data.split('_')[1]}` }],
						[{ text: 'Exit', callback_data: 'exit-payload' }],
					],
				};
				await ctx.api.editMessageText(messageToUpdate.message.chatId, messageToUpdate.message.id, 'Please enter a new name for the Wallpaper.', { reply_markup: editKeyboard, message_thread_id: messageToUpdate.message.message_thread_id });
			}
		}
	}

	if (data.split('_')[0] == 'Fix') {
		if (
			ctx.callbackQuery.from.id == 975024565 ||
			ctx.callbackQuery.from.id == 934949695 ||
			ctx.callbackQuery.from.id == 1889905927 ||
			ctx.callbackQuery.from.id == 127070302
		) {
			if (updateMessage.filter(msg => msg.userId === ctx.callbackQuery.from.id).length > 0) {
				const messageToUpdate = updateMessage.filter(msg => msg.userId === ctx.callbackQuery.from.id)[0];
				await fixWall(ctx, data.split('_')[1], messageToUpdate);

				setTimeout(async () => {
					await ctx.api.deleteMessage(messageToUpdate.message.chatId, messageToUpdate.message.id);
				}, 10000);
		
				updateMessage = updateMessage.filter((fil) => fil.userId !== ctx.callbackQuery.from.id);
				console.log(updateMessage);
			}
		}
	}

	if (data.split('_')[0] == 'Del') {
		const uploader = await Uploader.find({ userID: ctx.callbackQuery.from.id });

		if (
			uploader.length > 0
		) {
			if (updateMessage.filter(msg => msg.userId === ctx.callbackQuery.from.id).length > 0) {
				const messageToUpdate = updateMessage.filter(msg => msg.userId === ctx.callbackQuery.from.id)[0];
				await deleteWall(ctx, data.split('_')[1], messageToUpdate);

				setTimeout(async () => {
					await ctx.api.deleteMessage(messageToUpdate.message.chatId, messageToUpdate.message.id);
				}, 5000);
		
				updateMessage = updateMessage.filter((fil) => fil.userId !== ctx.callbackQuery.from.id);
				console.log(updateMessage);
			}
		}
	}

	if (data.split('_')[0] == 'EdC') {
		const uploader = await Uploader.find({ userID: ctx.callbackQuery.from.id });

		if (
			uploader.length > 0
		) {
			if (updateMessage.filter(msg => msg.userId === ctx.callbackQuery.from.id).length > 0) {
				const messageToUpdate = updateMessage.filter(msg => msg.userId === ctx.callbackQuery.from.id)[0];
				await editCategoryMenu(ctx, messageToUpdate);
				wallId = data.split('_')[1];
			}
		}
	}

	if (data.split('_')[0] == 'ChC') {
		const uploader = await Uploader.find({ userID: ctx.callbackQuery.from.id });

		if (
			uploader.length > 0
		) {
			if (updateMessage.filter(msg => msg.userId === ctx.callbackQuery.from.id).length > 0) {
				const messageToUpdate = updateMessage.filter(msg => msg.userId === ctx.callbackQuery.from.id)[0];
				await changeCategory(ctx, messageToUpdate, data.split('_')[1]);
			}
		}
	}

	if (data.split('_')[0] == 'Upl') {
		if (
			ctx.callbackQuery.from.id == 975024565 ||
			ctx.callbackQuery.from.id == 934949695 ||
			ctx.callbackQuery.from.id == 1889905927 ||
			ctx.callbackQuery.from.id == 127070302
		) {
			if (updateMessage.filter(msg => msg.userId === ctx.callbackQuery.from.id).length > 0) {
				const messageToUpdate = updateMessage.filter(msg => msg.userId === ctx.callbackQuery.from.id)[0];
				await userMenuMethod(ctx, messageToUpdate, parseInt(data.split('_')[1]));
			}
		}
	}

	if (data.split('_')[0] == "UUpl") {
		if (updateMessage.filter(msg => msg.userId === ctx.callbackQuery.from.id).length > 0) {
			const messageToUpdate = updateMessage.filter(msg => msg.userId === ctx.callbackQuery.from.id)[0];
			let uploader = await Uploader.find({ userID: parseInt(data.split('_')[1]) });
			if (uploader.length > 0) {
				await updateUserMethod(ctx, messageToUpdate, parseInt(data.split('_')[1]));

				setTimeout(async () => {
					await ctx.api.deleteMessage(messageToUpdate.message.chatId, messageToUpdate.message.id);
				}, 5000);
		
				updateMessage = updateMessage.filter((fil) => fil.userId !== ctx.callbackQuery.from.id);
				console.log(updateMessage);
			}
		}
	}

	if (data.split('_')[0] == "EUpl") {
		if (updateMessage.filter(msg => msg.userId === ctx.callbackQuery.from.id).length > 0) {
			const messageToUpdate = updateMessage.filter(msg => msg.userId === ctx.callbackQuery.from.id)[0];
			let uploader = await Uploader.find({ userID: parseInt(data.split('_')[1]) });
			if (uploader.length > 0) {
				await editUserMenuMethod(ctx, messageToUpdate, parseInt(data.split('_')[1]));
			}
		}
	}

	if (data.split('_')[0] == "EUs") {
		if (updateMessage.filter(msg => msg.userId === ctx.callbackQuery.from.id).length > 0) {
			const messageToUpdate = updateMessage.filter(msg => msg.userId === ctx.callbackQuery.from.id)[0];
			let uploader = await Uploader.find({ userID: parseInt(data.split('_')[1]) });
			if (uploader.length > 0) {
				editUploaderName.push(ctx.callbackQuery.from.id);
				console.log("Edit Uploader Name Array - ", editUploaderName);
				userId = parseInt(data.split('_')[1]);
				console.log(updateMessage)
				let editKeyboard = {
					inline_keyboard: [
						[{ text: 'Go back', callback_data: `go-back-from-edit-payload` }],
						[{ text: 'Exit', callback_data: 'exit-payload' }],
					],
				};

				await ctx.api.editMessageText(messageToUpdate.message.chatId, messageToUpdate.message.id, 'Please enter a new username.', { reply_markup: editKeyboard, message_thread_id: messageToUpdate.message.message_thread_id });
			}
		}
	}

	if (data.split('_')[0] == "RPfp") {
		if (updateMessage.filter(msg => msg.userId === ctx.callbackQuery.from.id).length > 0) {
			const messageToUpdate = updateMessage.filter(msg => msg.userId === ctx.callbackQuery.from.id)[0];
			let uploader = await Uploader.find({ userID: parseInt(data.split('_')[1]) });
			if (uploader.length > 0) {
				await removeUploaderPfpMethod(ctx, messageToUpdate, parseInt(data.split('_')[1]));

				setTimeout(async () => {
					await ctx.api.deleteMessage(messageToUpdate.message.chatId, messageToUpdate.message.id);
				}, 5000);
		
				updateMessage = updateMessage.filter((fil) => fil.userId !== ctx.callbackQuery.from.id);
				console.log(updateMessage);
			}
		}
	}

	if (data.split('_')[0] == 'DUpl') {
		if (
			ctx.callbackQuery.from.id == 975024565 ||
			ctx.callbackQuery.from.id == 934949695 ||
			ctx.callbackQuery.from.id == 1889905927 ||
			ctx.callbackQuery.from.id == 127070302
		) {
			if (updateMessage.filter(msg => msg.userId === ctx.callbackQuery.from.id).length > 0) {
				const messageToUpdate = updateMessage.filter(msg => msg.userId === ctx.callbackQuery.from.id)[0];
				let uploader = await Uploader.find({ userID: parseInt(data.split('_')[1]) });
				if (uploader.length > 0) {
					await deleteUserMethod(ctx, messageToUpdate, parseInt(data.split('_')[1]));

					setTimeout(async () => {
						await ctx.api.deleteMessage(messageToUpdate.message.chatId, messageToUpdate.message.id);
					}, 5000);
			
					updateMessage = updateMessage.filter((fil) => fil.userId !== ctx.callbackQuery.from.id);
					console.log(updateMessage);
				}
			}
		}
	}

	if (data.split('_')[0] == 'RUpl') {
		if (updateMessage.filter(msg => msg.userId === ctx.callbackQuery.from.id).length > 0) {
			const messageToUpdate = updateMessage.filter(msg => msg.userId === ctx.callbackQuery.from.id)[0];
			let uploader = await Uploader.find({ userID: parseInt(data.split('_')[1]) });
			if (uploader.length > 0) {
				const uploader = await Uploader.findOneAndUpdate({ userID: parseInt(data.split('_')[1]) }, { password: null });

    			await ctx.api.editMessageText(messageToUpdate.message.chatId, messageToUpdate.message.id, `Uploader - ${uploader.username}'s password reset successfully.`, {reply_markup: {}, message_thread_id: messageToUpdate.message.message_thread_id });

				setTimeout(async () => {
					await ctx.api.deleteMessage(messageToUpdate.message.chatId, messageToUpdate.message.id);
				}, 5000);
		
				updateMessage = updateMessage.filter((fil) => fil.userId !== ctx.callbackQuery.from.id);
				console.log(updateMessage);
			}
		}
	}

	if (data.split('_')[0] == 'WUpl') {
		if (updateMessage.filter(msg => msg.userId === ctx.callbackQuery.from.id).length > 0) {
			const messageToUpdate = updateMessage.filter(msg => msg.userId === ctx.callbackQuery.from.id)[0];
			let uploader = await Uploader.find({ userID: parseInt(data.split('_')[1]) });
			if (uploader.length > 0) { 
				await uploaderWallsMenu(ctx, messageToUpdate, parseInt(data.split('_')[1]), 0);
			}
		}
	}

	if (data.split('_')[0] == 'UpW') {
		if (updateMessage.filter(msg => msg.userId === ctx.callbackQuery.from.id).length > 0) {
			const messageToUpdate = updateMessage.filter(msg => msg.userId === ctx.callbackQuery.from.id)[0];
			let uploader = await Uploader.find({ userID: parseInt(data.split('_')[1]) });
			if (uploader.length > 0) {
				await uploaderWallsMenu(ctx, messageToUpdate, parseInt(data.split('_')[1]), data.split('_')[2]);
			}
		}
	}

	if (data.split('_')[0] == 'Av') {
		if (updateMessage.filter(msg => msg.userId === ctx.callbackQuery.from.id).length > 0) {
			const messageToUpdate = updateMessage.filter(msg => msg.userId === ctx.callbackQuery.from.id)[0];
			let uploader = await Uploader.find({ userID: data.split('_')[1] });
			if (uploader.length > 0) {
				addAvatar.push(ctx.callbackQuery.from.id);
				console.log("Add Avatar Array - ", addAvatar);

				let editKeyboard = {
					inline_keyboard: [
						[{ text: 'Go back', callback_data: `go-back-from-edit-payload` }],
						[{ text: 'Exit', callback_data: 'exit-payload' }],
					],
				};

				userId = parseInt(data.split('_')[1]);
				console.log(updateMessage);

				await ctx.api.editMessageText(messageToUpdate.message.chatId, messageToUpdate.message.id, 'Please upload a new Profile Pic to show in United Walls. The Picture should be either png or jpg, and should be around 320px - 320px square dimension. Should be in the form of a Document/File and not compressed photo.', { reply_markup: editKeyboard, message_thread_id: messageToUpdate.message.message_thread_id });
			}
		}
	}
});

// Check messages
bot.on('message', async (ctx) => {
	if (generateInvitations.includes(ctx.message.from.id)) {
		generateInvitations = generateInvitations.filter((fil) => { ctx.update.message.from.id != fil });
		console.log("Generate Invitations Array - ", generateInvitations);
		if (
			ctx.message.from.id == 975024565 ||
			ctx.message.from.id == 934949695 ||
			ctx.message.from.id == 1889905927 ||
			ctx.message.from.id == 127070302
		) {
			if (updateMessage.filter((msg) => msg.userId === ctx.message.from.id).length > 0) {
				const messageToUpdate = updateMessage.filter((msg) => msg.userId === ctx.message.from.id)[0];
				await generateInvitationsMethod(ctx, messageToUpdate);
			}

			updateMessage = updateMessage.filter((fil) => fil.userId !== ctx.message.from.id);
			console.log(updateMessage);
			return;
		} else {
			updateMessage = updateMessage.filter((fil) => fil.userId !== ctx.message.from.id);
			console.log(updateMessage);
			return;
		}
	}

	if (registers.includes(ctx.message.from.id)) {
		registers = registers.filter((fil) => { ctx.update.message.from.id != fil });
		console.log("Register Array - ", registers);
		if (updateMessage.filter((msg) => msg.userId === ctx.message.from.id).length > 0) {
			const messageToUpdate = updateMessage.filter((msg) => msg.userId === ctx.message.from.id)[0];
			await registerMethod(ctx, messageToUpdate);

			setTimeout(async () => {
				await ctx.api.deleteMessage(messageToUpdate.message.chatId, messageToUpdate.message.id);
			}, 10000);
	
			updateMessage = updateMessage.filter((fil) => fil.userId !== ctx.message.from.id);
			console.log(updateMessage);
			return;
		} 
	}

	if (invitation.includes(ctx.message.from.id)) {
		invitation = invitation.filter((fil) => { ctx.update.message.from.id != fil });
		console.log("Invitations Array - ", invitation);

		if (updateMessage.filter((msg) => msg.userId === ctx.message.from.id).length > 0) {
			const messageToUpdate = updateMessage.filter((msg) => msg.userId === ctx.message.from.id)[0];
			const invitationExists = await Invite.find({token: ctx.update.message.text});
			const currentDate = new Date;

			if (invitationExists.length > 0) {
				if (invitationExists[0].expiry > currentDate && invitationExists[0].used === false) {
					await Invite.findOneAndUpdate({ used: true });
					registers.push(ctx.message.from.id);
					console.log("Register Array - ", registers);

					let editKeyboard = {
						inline_keyboard: [
							[{ text: 'Cancel', callback_data: 'exit-payload' }],
						],
					};
	
					await ctx.api.editMessageText(messageToUpdate.message.chatId, messageToUpdate.message.id, 'Please enter a password. Should be more than 5 digits, should have alpha-numeric characters, etc. You know the drill.', { reply_markup: editKeyboard, message_thread_id: messageToUpdate.message.message_thread_id });

					return;
				} else {
					await ctx.api.editMessageText(messageToUpdate.message.chatId, messageToUpdate.message.id, "Invitation Code doesn't exist. Who sent you this? Please let us admins know about this in t.me/unitedsetups.", { reply_markup: editKeyboard, message_thread_id: messageToUpdate.message.message_thread_id });
					await ctx.api.sendMessage(
					-1001731686694,
						`<b>Error</b> - \n\n<b>${ctx.update.message.from.username}</b> tried to use an expired Invitation Code.`, { message_thread_id: 77299, parse_mode: 'HTML' }
					);
	
					setTimeout(async () => {
						await ctx.api.deleteMessage(messageToUpdate.message.chatId, messageToUpdate.message.id);
					}, 5000);
			
					updateMessage = updateMessage.filter((fil) => fil.userId !== ctx.message.from.id);
					console.log(updateMessage);
					return;
				}
			} else {
				await ctx.api.editMessageText(messageToUpdate.message.chatId, messageToUpdate.message.id, "Invitation Code doesn't exist. Who sent you this? Please let us admins know about this in t.me/unitedsetups.", { reply_markup: editKeyboard, message_thread_id: messageToUpdate.message.message_thread_id });
				await ctx.api.sendMessage(
					-1001731686694,
					`<b>Error</b> - \n\n<b>${ctx.update.message.from.username}</b> might contact you about how the Invitation Code did not exist.`, { message_thread_id: 77299, parse_mode: 'HTML' }
				);
				setTimeout(async () => {
					await ctx.api.deleteMessage(messageToUpdate.message.chatId, messageToUpdate.message.id);
				}, 5000);
		
				updateMessage = updateMessage.filter((fil) => fil.userId !== ctx.message.from.id);
				console.log(updateMessage);
				return;
			}
			
		}
	}

	if (addAvatar.includes(ctx.message.from.id)) {
		addAvatar = addAvatar.filter((fil) => { ctx.update.message.from.id != fil });
		console.log("Add Avatar Array - ", addAvatar);

		if (updateMessage.filter((msg) => msg.userId === ctx.message.from.id).length > 0) {
			const messageToUpdate = updateMessage.filter((msg) => msg.userId === ctx.message.from.id)[0];
			await addAvatarMethod(ctx, messageToUpdate, userId);

			await ctx.api.deleteMessage(ctx.message.chat.id, ctx.message.message_id);

			setTimeout(async () => {
				await ctx.api.deleteMessage(messageToUpdate.message.chatId, messageToUpdate.message.id);
			}, 5000);
	
			updateMessage = updateMessage.filter((fil) => fil.userId !== ctx.message.from.id);
			console.log(updateMessage);
			return;
		}
	}

	if (editName.includes(ctx.message.from.id)) {
		editName = editName.filter((fil) => { ctx.update.message.from.id != fil });
		console.log("Edit Name Array - ", editName);

		if (updateMessage.filter((msg) => msg.userId === ctx.message.from.id).length > 0) {
			const messageToUpdate = updateMessage.filter((msg) => msg.userId === ctx.message.from.id)[0];
			await editWallName(ctx, messageToUpdate, wallId);

			await ctx.api.deleteMessage(ctx.message.chat.id, ctx.message.message_id);

			setTimeout(async () => {
				await ctx.api.deleteMessage(messageToUpdate.message.chatId, messageToUpdate.message.id);
			}, 5000);
	
			updateMessage = updateMessage.filter((fil) => fil.userId !== ctx.message.from.id);
			console.log(updateMessage);

			return;
		}
	}

	if (editUploaderName.includes(ctx.message.from.id)) {
		editUploaderName = editUploaderName.filter((fil) => { ctx.update.message.from.id != fil });
		console.log("Edit Uploader Name Array - ", editUploaderName);

		if (updateMessage.filter((msg) => msg.userId === ctx.message.from.id).length > 0) {
			const messageToUpdate = updateMessage.filter((msg) => msg.userId === ctx.message.from.id)[0];
			console.log(messageToUpdate);
			await editUploaderUsernameMethod(ctx, messageToUpdate, userId);

			await ctx.api.deleteMessage(ctx.message.chat.id, ctx.message.message_id);
			
			setTimeout(async () => {
				await ctx.api.deleteMessage(messageToUpdate.message.chatId, messageToUpdate.message.id);
			}, 5000);
	
			updateMessage = updateMessage.filter((fil) => fil.userId !== ctx.message.from.id);
			console.log(updateMessage);
			return;
		}
	}

	if (denyWall.includes(ctx.message.from.id)) {
		denyWall = denyWall.filter(ids => ids != ctx.message.from.id);
		console.log("Deny Wall Name Array -", denyWall);
		const wall = await Walls.findById(wallId).populate('creator');
		const category = await Category.findById(wall.category);
		const delWall = await Walls.findByIdAndDelete(wallId);
		const tempWall = await TempWalls.findOneAndDelete({ wall: delWall });
		fs.stat(`./storage/wallpapers/temp/${category.name.replace(/\s/g, "").trim()}/${wall.file_name}.${wall.file_ext}`, function (err, stats) {
			if (err) {
				return console.error(err);
			}
		
			fs.unlink(`./storage/wallpapers/temp/${category.name.replace(/\s/g, "").trim()}/${wall.file_name}.${wall.file_ext}`,function(err){
				if(err) return console.log(err);
				console.log(`${wall.file_name}.${wall.file_ext} file deleted successfully from temp folder`);
			});  
		});
		await ctx.api.editMessageCaption(-1001731686694, tempWall.messageID, { reply_markup: {}, caption: `Denied by ${ ctx.message.from.username }` });
		await ctx.api.sendDocument(wall.creator.userID, wall.file_id, { caption: `Your Wallpaper has been denied by our Admins because of the following reason -\n\n"${ctx.message.text}"\n\nIf you have any further questions, please contact our Admins in the https://t.me/unitedsetups group. Thank you! :)` });
	}
	
	const msg = ctx.message;

	if (
		!('document' in msg) &&
		msg.is_topic_message &&
		msg.message_thread_id &&
		msg.message_thread_id == 185847 &&
		msg.from.id != 975024565 &&
		msg.from.id != 1889905927 &&
		msg.from.id != 127070302
	) {
		await ctx.api.deleteMessage(msg.chat.id, msg.message_id);

		const replyMessage = await ctx.reply(
			`@${msg.from.username ? msg.from.username + ", " : ""}The Wallpapers topic is only for sharing your Wallpapers, you can't message anything there. If you have a wallpaper, share that, or please refrain from using this Topic. Thanks!`, { message_thread_id: 185847, parse_mode: 'HTML' }
		);

		setTimeout(async () => {
			await ctx.api.deleteMessage(replyMessage.chat.id, replyMessage.message_id);	
		}, 10000);

		return;
	}

	if (
		!('photo' in msg) &&
		msg.is_topic_message &&
		msg.message_thread_id &&
		msg.message_thread_id == 185884 &&
		msg.from.id != 975024565 &&
		msg.from.id != 1889905927 &&
		msg.from.id != 127070302
	) {
		await ctx.api.deleteMessage(msg.chat.id, msg.message_id);

		const replyMessage = await ctx.reply(
			`@${msg.from.username ? msg.from.username + ", " : ""}If you want to comment on a Setup please forward it into the corresponding group. The Setups topic itself is only for posting setups.`, { message_thread_id: 185884, parse_mode: 'HTML' }
		);

		setTimeout(async () => {
			await ctx.api.deleteMessage(replyMessage.chat.id, replyMessage.message_id);	
		}, 10000);

		return;
	}
	await checkWallUploads(msg, bot, ctx);
});

//


bot.catch(async (err) => {
	const ctx = err.ctx;
	console.error(`Error while handling update ${ctx.update.update_id}`);
	const e = err.error;
	if (e instanceof GrammyError) {
		console.error('Error in request:', e.description);
	} else if (e instanceof HttpError) {
		console.error('Could not contact Telegram:', e);
	} else {
		console.error('Unknown error:', e);
	}
});

module.exports = TgBot = bot;
