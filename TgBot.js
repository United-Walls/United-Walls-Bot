const { Bot, InlineKeyboard, GrammyError, HttpError } = require('grammy');
require('dotenv').config();
// Create new instance of Bot class, pass your token in the Bot constructor.
const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN, {
	client: {
		apiRoot: "http://10.0.0.72:8081"
	}
});
const menuMethod = require('./tgBotFunctions/menu');
const unauthorized = require('./tgBotFunctions/unauthorized');
const deleteMessage = require('./tgBotFunctions/delete');
const categoriesMenu = require('./tgBotFunctions/categoriesMenu');
const categoryWallsMenu = require('./tgBotFunctions/categoryWallsMenu');
const wallMenu = require('./tgBotFunctions/wallMenu');
const checkWallUploads = require('./tgBotFunctions/checkWallUploads');
const editWallName = require('./tgBotFunctions/editWallName');
const addUploaderMethod = require('./tgBotFunctions/addUploader');
const deleteWall = require('./tgBotFunctions/deleteWall');
const editCategoryMenu = require('./tgBotFunctions/editCategoryMenu');
const changeCategory = require('./tgBotFunctions/changeCategory');
const addUploaderIDMethod = require('./tgBotFunctions/addUploaderID');
const Uploader = require('./models/Uploader');
const uploaderMenuMethod = require('./tgBotFunctions/uploaderMenu');
const usersMenuMethod = require('./tgBotFunctions/usersMenu');
const userMenuMethod = require('./tgBotFunctions/userMenu');
const updateUserMethod = require('./tgBotFunctions/updateUser');
const editUserMenuMethod = require('./tgBotFunctions/editUserMenu');
const editUploaderUsernameMethod = require('./tgBotFunctions/editUploaderUsername');
const removeUploaderPfpMethod = require('./tgBotFunctions/removeUploaderPfp');
const deleteUserMethod = require('./tgBotFunctions/deleteUser');
const uploaderWallsMenu = require('./tgBotFunctions/uploaderWallsMenu');

// Register listeners below
// Handle /start command
bot.command('start', async (ctx) => {
	await ctx.reply(
		'*Hi\\!* _Welcome_ to [United Walls](t.me/UnitedWalls_Bot)\\.',
		{ parse_mode: 'MarkdownV2' }
	);
	await ctx.reply(
		"As you see\\, I'm just a bot\\. Join our Group to access our Awesome Walls\\! \\:\\)\n\nOur Group is [United Setups](t.me/unitedsetups)\\.",
		{ parse_mode: 'MarkdownV2' }
	);
});

let messageToDelete2 = 0;
let messageToDelete = 0;
let chat_id = 0;
let editName = false;
let addUploader = false;
let addUploaderID = false;
let wallId = '';
let userId = '';
let editUploaderName = false;
let page = 0;

bot.command('menu', async (ctx) => {
	messageToDelete2 = 0;
	messageToDelete = ctx.update.message.message_id + 1;
	chat_id = ctx.update.message.chat.id;

	let uploaderExists = Uploader.find({ userID: ctx.update.message.from.id }).length > 0;

	if (
		ctx.update.message.from.id == 975024565 ||
		ctx.update.message.from.id == 934949695 ||
		ctx.update.message.from.id == 1889905927 ||
		ctx.update.message.from.id == 127070302
	) {
		const inlineKeyboard = new InlineKeyboard()
			.text('Wall Categories', 'edit-payload')
			.row()
			.text('Your Wallpapers', `WUpl_${ctx.update.message.from.id}`)
			.row()
			.text('Add Uploader', 'add-user-payload')
			.row()
			.text('Edit Uploaders', 'edit-user-payload')
			.row()
			.text('Exit', 'exit-payload');

		await menuMethod(ctx, true, inlineKeyboard);
	} else if (uploaderExists) {
		const inlineUploaderKeyboard = new InlineKeyboard()
			.text('Your Wallpapers', `WUpl_${ctx.update.message.from.id}`)
			.row()
			.text('Exit', 'exit-payload');

		await uploaderMenuMethod(ctx, true, inlineUploaderKeyboard);
	} else {
		await unauthorized(ctx, chat_id, messageToDelete);
	}
});

bot.callbackQuery('exit-payload', async (ctx) => {
	await deleteMessage(ctx, chat_id, messageToDelete, messageToDelete2);
});

bot.callbackQuery('add-user-payload', async (ctx) => {
	await deleteMessage(ctx, chat_id, messageToDelete, messageToDelete2);

	messageToDelete2 = 0;
	messageToDelete = ctx.update.callback_query.message.message_id + 1;

	chat_id = ctx.update.callback_query.message.chat.id;

	if (
		ctx.update.callback_query.from.id == 975024565 ||
		ctx.update.callback_query.from.id == 934949695 ||
		ctx.update.callback_query.from.id == 1889905927 ||
		ctx.update.callback_query.from.id == 127070302
	) {
		messageToDelete2 = 0;
		messageToDelete = ctx.update.callback_query.message.message_id + 1;
		chat_id = ctx.update.callback_query.message.chat.id;
		addUploaderID = true;

		let editKeyboard = {
			inline_keyboard: [
				[{ text: 'Go back', callback_data: 'go-back-from-edit-payload' }],
				[{ text: 'Exit', callback_data: 'exit-payload' }],
			],
		};

		await ctx.reply(
			'Please enter the ID of the Uploader.',
			{
				reply_markup: editKeyboard,
			}
		);
	} else {
		await unauthorized(ctx, chat_id, messageToDelete);
	}
});

bot.callbackQuery('edit-user-payload', async (ctx) => {
	await deleteMessage(ctx, chat_id, messageToDelete, messageToDelete2);

	messageToDelete2 = 0;
	messageToDelete = ctx.update.callback_query.message.message_id + 1;
	chat_id = ctx.update.callback_query.message.chat.id;

	if (
		ctx.update.callback_query.from.id == 975024565 ||
		ctx.update.callback_query.from.id == 934949695 ||
		ctx.update.callback_query.from.id == 1889905927 ||
		ctx.update.callback_query.from.id == 127070302
	) {
		await usersMenuMethod(ctx);
	} else {
		await unauthorized(ctx, chat_id, messageToDelete);
	}
});

// Wait for click events with specific callback data.
bot.callbackQuery('edit-payload', async (ctx) => {
	await deleteMessage(ctx, chat_id, messageToDelete, messageToDelete2);

	messageToDelete2 = 0;
	messageToDelete = ctx.update.callback_query.message.message_id + 1;
	chat_id = ctx.update.callback_query.message.chat.id;

	if (
		ctx.update.callback_query.from.id == 975024565 ||
		ctx.update.callback_query.from.id == 934949695 ||
		ctx.update.callback_query.from.id == 1889905927 ||
		ctx.update.callback_query.from.id == 127070302
	) {
		await categoriesMenu(ctx);
	} else {
		await unauthorized(ctx, chat_id, messageToDelete);
	}
});

bot.callbackQuery('go-back-from-edit-payload', async (ctx) => {
	addUploaderID = false;
	editName = false;
	addUploader = false;
	editUploaderName = false;
	await deleteMessage(ctx, chat_id, messageToDelete, messageToDelete2);

	messageToDelete2 = 0;
	messageToDelete = ctx.update.callback_query.message.message_id + 1;
	chat_id = ctx.update.callback_query.message.chat.id;

	let uploaderExists = Uploader.find({ userID: ctx.update.callback_query.from.id }).length > 0;

	if (
		ctx.update.callback_query.from.id == 975024565 ||
		ctx.update.callback_query.from.id == 934949695 ||
		ctx.update.callback_query.from.id == 1889905927 ||
		ctx.update.callback_query.from.id == 127070302
	) {
		const inlineKeyboard = new InlineKeyboard()
			.text('Wall Categories', 'edit-payload')
			.row()
			.text('Your Wallpapers', `WUpl_${ctx.update.callback_query.from.id}`)
			.row()
			.text('Add Uploader', 'add-user-payload')
			.row()
			.text('Edit Uploaders', 'edit-user-payload')
			.row()
			.text('Exit', 'exit-payload');
			
		await menuMethod(ctx, false, inlineKeyboard);
	} else if (uploaderExists) {
		const inlineKeyboard = new InlineKeyboard()
			.text('Your Wallpapers', `WUpl_${ctx.update.callback_query.from.id}`)
			.row()
			.text('Exit', 'exit-payload');

		await uploaderMenuMethod(ctx, false, inlineKeyboard);
	} else {
		await unauthorized(ctx, chat_id, messageToDelete);
	}
});

bot.on('callback_query:data', async (ctx) => {
	await deleteMessage(ctx, chat_id, messageToDelete, messageToDelete2);

	const data = ctx.update.callback_query.data;

	if (data.split('_')[0] == 'Cat') {
		messageToDelete2 = 0;
		messageToDelete = ctx.update.callback_query.message.message_id + 1;
		chat_id = ctx.update.callback_query.message.chat.id;

		if (
			ctx.update.callback_query.from.id == 975024565 ||
			ctx.update.callback_query.from.id == 934949695 ||
			ctx.update.callback_query.from.id == 1889905927 ||
			ctx.update.callback_query.from.id == 127070302
		) {
			await categoryWallsMenu(ctx, data);
		} else {
			await unauthorized(ctx, chat_id, messageToDelete);
		}
	}

	if (data.split('_')[0] == 'Wal') {
		messageToDelete2 = ctx.update.callback_query.message.message_id + 2;
		messageToDelete = ctx.update.callback_query.message.message_id + 1;
		chat_id = ctx.update.callback_query.message.chat.id;

		if (
			ctx.update.callback_query.from.id == 975024565 ||
			ctx.update.callback_query.from.id == 934949695 ||
			ctx.update.callback_query.from.id == 1889905927 ||
			ctx.update.callback_query.from.id == 127070302
		) {
			await wallMenu(ctx, data, chat_id);
		} else {
			await unauthorized(ctx, chat_id, messageToDelete);
		}
	}

	if (data.split('_')[0] == 'EdN') {
		messageToDelete2 = 0;
		messageToDelete = ctx.update.callback_query.message.message_id + 1;
		chat_id = ctx.update.callback_query.message.chat.id;

		if (
			ctx.update.callback_query.from.id == 975024565 ||
			ctx.update.callback_query.from.id == 934949695 ||
			ctx.update.callback_query.from.id == 1889905927 ||
			ctx.update.callback_query.from.id == 127070302
		) {
			editName = true;
			wallId = data.split('_')[1];

			let editKeyboard = {
				inline_keyboard: [
					[{ text: 'Go back', callback_data: `Wal_${data.split('_')[1]}` }],
					[{ text: 'Exit', callback_data: 'exit-payload' }],
				],
			};

			await ctx.reply('Please enter a new name for the Wallpaper.', {
				reply_markup: editKeyboard,
			});
		} else {
			await unauthorized(ctx, chat_id, messageToDelete);
		}
	}

	if (data.split('_')[0] == 'AdU') {
		messageToDelete2 = 0;
		messageToDelete = ctx.update.callback_query.message.message_id + 1;
		chat_id = ctx.update.callback_query.message.chat.id;

		if (
			ctx.update.callback_query.from.id == 975024565 ||
			ctx.update.callback_query.from.id == 934949695 ||
			ctx.update.callback_query.from.id == 1889905927 ||
			ctx.update.callback_query.from.id == 127070302
		) {
			addUploader = true;
			wallId = data.split('_')[1];

			let editKeyboard = {
				inline_keyboard: [
					[{ text: 'Go back', callback_data: `Wal_${data.split('_')[1]}` }],
					[{ text: 'Exit', callback_data: 'exit-payload' }],
				],
			};

			await ctx.reply(
				'Please enter the name of the Uploader of the Wallpaper.',
				{
					reply_markup: editKeyboard,
				}
			);
		} else {
			await unauthorized(ctx, chat_id, messageToDelete);
		}
	}

	if (data.split('_')[0] == 'Del') {
		messageToDelete2 = 0;
		messageToDelete = ctx.update.callback_query.message.message_id + 1;
		chat_id = ctx.update.callback_query.message.chat.id;

		if (
			ctx.update.callback_query.from.id == 975024565 ||
			ctx.update.callback_query.from.id == 934949695 ||
			ctx.update.callback_query.from.id == 1889905927 ||
			ctx.update.callback_query.from.id == 127070302
		) {
			const fileName = await deleteWall(data.split('_')[1]);

			await ctx.reply('Wallpaper - ' + fileName + ' Deleted.');

			setTimeout(async () => {
				await deleteMessage(ctx, chat_id, messageToDelete, messageToDelete2);
			}, 3500);
		} else {
			await unauthorized(ctx, chat_id, messageToDelete);
		}
	}

	if (data.split('_')[0] == 'EdC') {
		messageToDelete2 = 0;
		messageToDelete = ctx.update.callback_query.message.message_id + 1;
		chat_id = ctx.update.callback_query.message.chat.id;

		if (
			ctx.update.callback_query.from.id == 975024565 ||
			ctx.update.callback_query.from.id == 934949695 ||
			ctx.update.callback_query.from.id == 1889905927 ||
			ctx.update.callback_query.from.id == 127070302
		) {
			wallId = data.split('_')[1];

			await editCategoryMenu(ctx);
		} else {
			await unauthorized(ctx, chat_id, messageToDelete);
		}
	}

	if (data.split('_')[0] == 'ChC') {
		messageToDelete2 = 0;
		messageToDelete = ctx.update.callback_query.message.message_id + 1;
		chat_id = ctx.update.callback_query.message.chat.id;

		if (
			ctx.update.callback_query.from.id == 975024565 ||
			ctx.update.callback_query.from.id == 934949695 ||
			ctx.update.callback_query.from.id == 1889905927 ||
			ctx.update.callback_query.from.id == 127070302
		) {
			await changeCategory(ctx, wallId, data.split('_')[1]);
			wallId = '';
			setTimeout(async () => {
				await deleteMessage(ctx, chat_id, messageToDelete, messageToDelete2);
			}, 3500);
		} else {
			await unauthorized(ctx, chat_id, messageToDelete);
		}
	}

	if (data.split('_')[0] == 'Upl') {
		messageToDelete2 = 0;
		messageToDelete = ctx.update.callback_query.message.message_id + 1;
		chat_id = ctx.update.callback_query.message.chat.id;

		if (
			ctx.update.callback_query.from.id == 975024565 ||
			ctx.update.callback_query.from.id == 934949695 ||
			ctx.update.callback_query.from.id == 1889905927 ||
			ctx.update.callback_query.from.id == 127070302
		) {
			userId = data.split('_')[1];

			await userMenuMethod(ctx, userId);
		} else {
			await unauthorized(ctx, chat_id, messageToDelete);
		}
	}

	if (data.split('_')[0] == "UUpl") {
		messageToDelete2 = 0;
		messageToDelete = ctx.update.callback_query.message.message_id + 1;
		chat_id = ctx.update.callback_query.message.chat.id;

		if (
			ctx.update.callback_query.from.id == 975024565 ||
			ctx.update.callback_query.from.id == 934949695 ||
			ctx.update.callback_query.from.id == 1889905927 ||
			ctx.update.callback_query.from.id == 127070302
		) {
			userId = data.split('_')[1];

			await updateUserMethod(ctx, userId);

			userId = '';
			
			setTimeout(async () => {
				await deleteMessage(ctx, chat_id, messageToDelete, messageToDelete2);
			}, 3500);
		} else {
			await unauthorized(ctx, chat_id, messageToDelete);
		}
	}

	if (data.split('_')[0] == "EUpl") {
		messageToDelete2 = 0;
		messageToDelete = ctx.update.callback_query.message.message_id + 1;
		chat_id = ctx.update.callback_query.message.chat.id;

		if (
			ctx.update.callback_query.from.id == 975024565 ||
			ctx.update.callback_query.from.id == 934949695 ||
			ctx.update.callback_query.from.id == 1889905927 ||
			ctx.update.callback_query.from.id == 127070302
		) {
			userId = data.split('_')[1];

			await editUserMenuMethod(ctx, userId);
		} else {
			await unauthorized(ctx, chat_id, messageToDelete);
		}
	}

	if (data.split('_')[0] == "EUs") {
		messageToDelete2 = 0;
		messageToDelete = ctx.update.callback_query.message.message_id + 1;
		chat_id = ctx.update.callback_query.message.chat.id;

		if (
			ctx.update.callback_query.from.id == 975024565 ||
			ctx.update.callback_query.from.id == 934949695 ||
			ctx.update.callback_query.from.id == 1889905927 ||
			ctx.update.callback_query.from.id == 127070302
		) {
			editUploaderName = true;
			userId = data.split('_')[1];

			let editKeyboard = {
				inline_keyboard: [
					[{ text: 'Go back', callback_data: `EUpl_${data.split('_')[1]}` }],
					[{ text: 'Exit', callback_data: 'exit-payload' }],
				],
			};

			await ctx.reply('Please enter a new username.', {
				reply_markup: editKeyboard,
			});
		} else {
			await unauthorized(ctx, chat_id, messageToDelete);
		}
	}

	if (data.split('_')[0] == "RPfp") {
		messageToDelete2 = 0;
		messageToDelete = ctx.update.callback_query.message.message_id + 1;
		chat_id = ctx.update.callback_query.message.chat.id;

		if (
			ctx.update.callback_query.from.id == 975024565 ||
			ctx.update.callback_query.from.id == 934949695 ||
			ctx.update.callback_query.from.id == 1889905927 ||
			ctx.update.callback_query.from.id == 127070302
		) {
			userId = data.split('_')[1];

			await removeUploaderPfpMethod(ctx, userId);

			setTimeout(async () => {
				await deleteMessage(ctx, chat_id, messageToDelete, messageToDelete2);
			}, 3500);
		} else {
			await unauthorized(ctx, chat_id, messageToDelete);
		}
	}

	if (data.split('_')[0] == 'DUpl') {
		messageToDelete2 = 0;
		messageToDelete = ctx.update.callback_query.message.message_id + 1;
		chat_id = ctx.update.callback_query.message.chat.id;

		if (
			ctx.update.callback_query.from.id == 975024565 ||
			ctx.update.callback_query.from.id == 934949695 ||
			ctx.update.callback_query.from.id == 1889905927 ||
			ctx.update.callback_query.from.id == 127070302
		) {
			userId = data.split('_')[1];

			await deleteUserMethod(ctx, userId);

			setTimeout(async () => {
				await deleteMessage(ctx, chat_id, messageToDelete, messageToDelete2);
			}, 3500);
		} else {
			await unauthorized(ctx, chat_id, messageToDelete);
		}
	}

	if (data.split('_')[0] == 'WUpl') {
		page = 0;
		messageToDelete2 = 0;
		messageToDelete = ctx.update.callback_query.message.message_id + 1;
		chat_id = ctx.update.callback_query.message.chat.id;

		if (
			ctx.update.callback_query.from.id == 975024565 ||
			ctx.update.callback_query.from.id == 934949695 ||
			ctx.update.callback_query.from.id == 1889905927 ||
			ctx.update.callback_query.from.id == 127070302
		) {
			userId = data.split('_')[1];

			await uploaderWallsMenu(ctx, userId, page);
		} else {
			await unauthorized(ctx, chat_id, messageToDelete);
		}
	}

	if (data.split('_')[0] == 'UpW') {
		messageToDelete2 = 0;
		messageToDelete = ctx.update.callback_query.message.message_id + 1;
		chat_id = ctx.update.callback_query.message.chat.id;

		if (
			ctx.update.callback_query.from.id == 975024565 ||
			ctx.update.callback_query.from.id == 934949695 ||
			ctx.update.callback_query.from.id == 1889905927 ||
			ctx.update.callback_query.from.id == 127070302
		) {
			userId = data.split('_')[1];
			page = data.split('_')[2];

			await uploaderWallsMenu(ctx, userId, page);
		} else {
			await unauthorized(ctx, chat_id, messageToDelete);
		}
	}
});

// Check messages
bot.on('message', async (ctx) => {
	if (editName == true) {
		await deleteMessage(ctx, chat_id, messageToDelete, messageToDelete2);

		messageToDelete2 = 0;
		messageToDelete = messageToDelete + 2;

		await editWallName(ctx, wallId);

		editName = false;
		wallId = '';

		setTimeout(async () => {
			await deleteMessage(ctx, chat_id, messageToDelete, messageToDelete2);
		}, 3500);

		return;
	}

	if (addUploader == true) {
		await deleteMessage(ctx, chat_id, messageToDelete, messageToDelete2);

		messageToDelete2 = 0;
		messageToDelete = messageToDelete + 2;

		await addUploaderMethod(ctx, wallId);

		addUploader = false;
		wallId = '';

		setTimeout(async () => {
			await deleteMessage(ctx, chat_id, messageToDelete, messageToDelete2);
		}, 3500);

		return;
	}

	if (addUploaderID == true) {
		await deleteMessage(ctx, chat_id, messageToDelete, messageToDelete2);

		messageToDelete2 = 0;
		messageToDelete = messageToDelete + 2;

		await addUploaderIDMethod(ctx);

		addUploaderID = false;

		setTimeout(async () => {
			await deleteMessage(ctx, chat_id, messageToDelete, messageToDelete2);
		}, 3500);

		return;
	}

	if (editUploaderName == true) {
		await deleteMessage(ctx, chat_id, messageToDelete, messageToDelete2);

		messageToDelete2 = 0;
		messageToDelete = messageToDelete + 2;

		await editUploaderUsernameMethod(ctx, userId);

		editUploaderName = false;
		userId = '';

		setTimeout(async () => {
			await deleteMessage(ctx, chat_id, messageToDelete, messageToDelete2);
		}, 3500);

		return;
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
		messageToDelete2 = 0;
		messageToDelete = ctx.message.message_id;
		chat_id = ctx.message.chat.id;

		await ctx.reply(
			`@${msg.from.username} The Wallpapers topic is only for sharing your Wallpapers, you can't message anything there. If you have a wallpaper, share that, or please refrain from using this Topic. Thanks!`
		);

		setTimeout(async () => {
			await deleteMessage(ctx, chat_id, messageToDelete, messageToDelete2);
		}, 3500);
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
		messageToDelete2 = 0;
		messageToDelete = ctx.message.message_id;
		chat_id = ctx.message.chat.id;

		await ctx.reply(
			`@${msg.from.username}, if you want to comment on a Setup please forward it into the corresponding group. The Setups topic itself is only for posting setups.`
		);

		setTimeout(async () => {
			await deleteMessage(ctx, chat_id, messageToDelete, messageToDelete2);
		}, 3500);
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
