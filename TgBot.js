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
const addAvatarMethod = require('./tgBotFunctions/addAvatar');
const Invite = require('./models/Invite');
const register = require('./tgBotFunctions/register');
const generateInvitationsMethod = require('./tgBotFunctions/generateInvitations');

let chat_id = 0;
let editName = [];
let addUploader = [];
let addUploaderID = [];
let wallId = '';
let userId = '';
let editUploaderName = [];
let page = 0;
let addAvatar = [];
let registers = [];
let invitation = [];
let generateInvitations = []

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

bot.command('register', async (ctx) => {
	chat_id = ctx.update.message.chat.id;

	let uploaderExists = await Uploader.find({ userID: ctx.update.message.from.id });

	console.log(uploaderExists);
	if (uploaderExists.length > 0) {
		const inlineKeyboard = new InlineKeyboard()
			.text('Yes', 'register-user')
			.row()
			.text('No', 'exit-payload');

		await ctx.reply(
			`Welcome to the United Walls Registration. @${uploaderExists[0].username}, it seems you are already added in our database. This registration is not necessary, and you can still use our bot to upload wallpapers, edit your profile, edit your wallpapers. This registration is only for our United Walls Creators App, available in both Play Store and App Store. The App will give you a more easier way to handle your wallpapers and your profile in a Graphical User Interface. Alongwith, a well defined dashboard. Do you want to proceed?`,
			{ reply_markup: inlineKeyboard }
		);
	} else {
		const inlineKeyboard = new InlineKeyboard()
			.text('Yes, I have an Invitation Code.', 'invitation-code')
			.row()
			.text('No, I do not have an Invitation Code.', 'exit-payload');

		await ctx.reply(
			`Welcome to the United Walls Registration. It seems, you aren't added in our Database. In order to be able to register, you require an invitation code. You need to ask the admins of t.me/unitedsetups. So do you have an Invitation Code?`,
			{ reply_markup: inlineKeyboard }
		);
	}
});

bot.callbackQuery('register-user', async (ctx) => {
	registers.push(ctx.update.callback_query.from.id);

	console.log("Register Array - ", registers);

	let editKeyboard = {
		inline_keyboard: [
			[{ text: 'Cancel', callback_data: 'exit-payload' }],
		],
	};

	await ctx.reply('Please enter a password. Should be more than 5 digits, should have alpha-numeric characters, etc. You know the drill.', {
		reply_markup: editKeyboard,
	});
});

bot.callbackQuery('invitation-code', async (ctx) => {
	invitation.push(ctx.update.callback_query.from.id);

	console.log("Invitation Array - ", invitation);

	let editKeyboard = {
		inline_keyboard: [
			[{ text: 'Cancel', callback_data: 'exit-payload' }],
		],
	};

	await ctx.reply('Please enter the Invitation Code.', {
		reply_markup: editKeyboard,
	});
});

bot.command('menu', async (ctx) => {
	chat_id = ctx.update.message.chat.id;

	let uploaderExists = await Uploader.find({ userID: ctx.update.message.from.id });

	if (
		ctx.update.message.from.id == 975024565 ||
		ctx.update.message.from.id == 934949695 ||
		ctx.update.message.from.id == 1889905927 ||
		ctx.update.message.from.id == 127070302
	) {
		const inlineKeyboard = new InlineKeyboard()
			.text('Wall Categories', 'edit-payload')
			.row()
			.text('Update your Profile (With your Telegram Data', `UUpl_${ctx.update.message.from.id}`)
			.row()
			.text('Edit your Profile (Username, image privacy, etc.)', `EUpl_${ctx.update.message.from.id}`)
			.row()
			.text('Your Wallpapers', `WUpl_${ctx.update.message.from.id}`)
			.row()
			.text('Add Uploader', 'add-user-payload')
			.row()
			.text('Edit Uploaders', 'edit-user-payload')
			.row()
			.text('Generate Invitations', 'generate-invitations')
			.row()
			.text('Your Generated Invitations', 'generated-invitations')
			.row()
			.text('Exit', 'exit-payload');

		await menuMethod(ctx, true, inlineKeyboard);
	} else if (uploaderExists.length > 0) {
		const inlineUploaderKeyboard = new InlineKeyboard()
			.text('Update your Profile (With your Telegram Data', `UUpl_${ctx.update.message.from.id}`)
			.row()
			.text('Edit your Profile (Username, image privacy, etc.)', `EUpl_${ctx.update.message.from.id}`)
			.row()
			.text('Your Wallpapers', `WUpl_${ctx.update.message.from.id}`)
			.row()
			.text('Exit', 'exit-payload');

		await uploaderMenuMethod(ctx, true, inlineUploaderKeyboard);
	} else {
		await unauthorized(ctx);
	}
});

bot.callbackQuery('generated-invitations', async (ctx) => {
	const uploader = await Uploader.findOne({userID: ctx.update.callback_query.from.id});
	const invites = await Invite.find({ uploader: uploader });
	let string = "";
	const currentDate = new Date;
	if (
		ctx.update.callback_query.from.id == 975024565 ||
		ctx.update.callback_query.from.id == 934949695 ||
		ctx.update.callback_query.from.id == 1889905927 ||
		ctx.update.callback_query.from.id == 127070302
	 ) {
		if (invites.length > 0) {
			for(let i = 0; i < invites.length; i++) {
				if (invites[i].expiry > currentDate && invites[i].used === false) {
					string += `Invite Code - ${invites[i].token}  |||  Expiry - ${invites[i].expiry.toLocaleString()}\n\n`;
				}
			}

			await ctx.reply(string);

			return;
		}
	 }
})

bot.callbackQuery('generate-invitations', async (ctx) => {
	if (
		ctx.update.callback_query.from.id == 975024565 ||
		ctx.update.callback_query.from.id == 934949695 ||
		ctx.update.callback_query.from.id == 1889905927 ||
		ctx.update.callback_query.from.id == 127070302
	 ) {
		generateInvitations.push(ctx.update.callback_query.from.id);

		console.log("Generate Invitations Array", generateInvitations);
	
		let editKeyboard = {
			inline_keyboard: [
				[{ text: 'Cancel', callback_data: 'exit-payload' }],
			],
		}
	
		await ctx.reply('How many Invitation Codes you want to generate? Enter a number', {
			reply_markup: editKeyboard,
		});
	} else {
		await unauthorized(ctx);
	}
})

bot.callbackQuery('exit-payload', async (ctx) => {
	registers = registers.filter((fil) => { ctx.update.callback_query.from.id != fil });
	invitation = invitation.filter((fil) => { ctx.update.callback_query.from.id != fil });
	addAvatar = addAvatar.filter((fil) => { ctx.update.callback_query.from.id != fil });
	editName = editName.filter((fil) => { ctx.update.callback_query.from.id != fil });
	addUploader = addUploader.filter((fil) => { ctx.update.callback_query.from.id != fil });
	addUploaderID = addUploaderID.filter((fil) => { ctx.update.callback_query.from.id != fil });
	editUploaderName = editUploaderName.filter((fil) => { ctx.update.callback_query.from.id != fil });
	generateInvitations = generateInvitations.filter((fil) => { ctx.update.callback_query.from.id != fil });

	await ctx.reply(
		`Ok! Bye, LOL!`
	);

	return;
});

bot.callbackQuery('add-user-payload', async (ctx) => {
	chat_id = ctx.update.callback_query.message.chat.id;

	if (
		ctx.update.callback_query.from.id == 975024565 ||
		ctx.update.callback_query.from.id == 934949695 ||
		ctx.update.callback_query.from.id == 1889905927 ||
		ctx.update.callback_query.from.id == 127070302
	) {
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
		await unauthorized(ctx);
	}
});

bot.callbackQuery('edit-user-payload', async (ctx) => {
	chat_id = ctx.update.callback_query.message.chat.id;

	if (
		ctx.update.callback_query.from.id == 975024565 ||
		ctx.update.callback_query.from.id == 934949695 ||
		ctx.update.callback_query.from.id == 1889905927 ||
		ctx.update.callback_query.from.id == 127070302
	) {
		await usersMenuMethod(ctx);
	} else {
		await unauthorized(ctx);
	}
});

// Wait for click events with specific callback data.
bot.callbackQuery('edit-payload', async (ctx) => {
	chat_id = ctx.update.callback_query.message.chat.id;

	if (
		ctx.update.callback_query.from.id == 975024565 ||
		ctx.update.callback_query.from.id == 934949695 ||
		ctx.update.callback_query.from.id == 1889905927 ||
		ctx.update.callback_query.from.id == 127070302
	) {
		await categoriesMenu(ctx);
	} else {
		await unauthorized(ctx);
	}
});

bot.callbackQuery('go-back-from-edit-payload', async (ctx) => {
	chat_id = ctx.update.callback_query.message.chat.id;

	let uploaderExists = await Uploader.find({ userID: ctx.update.callback_query.from.id });

	if (
		ctx.update.callback_query.from.id == 975024565 ||
		ctx.update.callback_query.from.id == 934949695 ||
		ctx.update.callback_query.from.id == 1889905927 ||
		ctx.update.callback_query.from.id == 127070302
	) {
		const inlineKeyboard = new InlineKeyboard()
			.text('Wall Categories', 'edit-payload')
			.row()
			.text('Update your Profile (With your Telegram Data', `UUpl_${ctx.update.callback_query.from.id}`)
			.row()
			.text('Edit your Profile (Username, image privacy, etc.)', `EUpl_${ctx.update.callback_query.from.id}`)
			.row()
			.text('Your Wallpapers', `WUpl_${ctx.update.callback_query.from.id}`)
			.row()
			.text('Add Uploader', 'add-user-payload')
			.row()
			.text('Edit Uploaders', 'edit-user-payload')
			.row()
			.text('Exit', 'exit-payload');
			
		await menuMethod(ctx, false, inlineKeyboard);
	} else if (uploaderExists.length > 0) {
		const inlineKeyboard = new InlineKeyboard()
			.text('Update your Profile (With your Telegram Data', `UUpl_${ctx.update.callback_query.from.id}`)
			.row()
			.text('Edit your Profile (Username, image privacy, etc.)', `EUpl_${ctx.update.callback_query.from.id}`)
			.row()
			.text('Your Wallpapers', `WUpl_${ctx.update.callback_query.from.id}`)
			.row()
			.text('Exit', 'exit-payload');

		await uploaderMenuMethod(ctx, false, inlineKeyboard);
	} else {
		await unauthorized(ctx);
	}
});

bot.on('callback_query:data', async (ctx) => {
	const data = ctx.update.callback_query.data;

	if (data.split('_')[0] == 'Cat') {
		chat_id = ctx.update.callback_query.message.chat.id;

		if (
			ctx.update.callback_query.from.id == 975024565 ||
			ctx.update.callback_query.from.id == 934949695 ||
			ctx.update.callback_query.from.id == 1889905927 ||
			ctx.update.callback_query.from.id == 127070302
		) {
			await categoryWallsMenu(ctx, data);
		} else {
			await unauthorized(ctx);
		}
	}

	if (data.split('_')[0] == 'Wal') {
		chat_id = ctx.update.callback_query.message.chat.id;

		let uploader = await Uploader.find({userID: ctx.update.callback_query.from.id});

		if (
			uploader.length > 0
		) {
			await wallMenu(ctx, data, chat_id);
		} else {
			await unauthorized(ctx);
		}
	}

	if (data.split('_')[0] == 'EdN') {
		chat_id = ctx.update.callback_query.message.chat.id;

		let uploader = await Uploader.find({userID: ctx.update.callback_query.from.id});

		if (
			uploader.length > 0
		) {
			editName.push(ctx.update.callback_query.from.id);
			console.log("Edit Name Array - ", editName);
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
			await unauthorized(ctx);
		}
	}

	if (data.split('_')[0] == 'AdU') {
		chat_id = ctx.update.callback_query.message.chat.id;

		if (
			ctx.update.callback_query.from.id == 975024565 ||
			ctx.update.callback_query.from.id == 934949695 ||
			ctx.update.callback_query.from.id == 1889905927 ||
			ctx.update.callback_query.from.id == 127070302
		) {
			addUploader.push(ctx.update.callback_query.from.id);
			console.log("Add Uploader Array - ", addUploader);
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
			await unauthorized(ctx);
		}
	}

	if (data.split('_')[0] == 'Del') {
		chat_id = ctx.update.callback_query.message.chat.id;

		if (
			ctx.update.callback_query.from.id == 975024565 ||
			ctx.update.callback_query.from.id == 934949695 ||
			ctx.update.callback_query.from.id == 1889905927 ||
			ctx.update.callback_query.from.id == 127070302
		) {
			const fileName = await deleteWall(data.split('_')[1]);

			await ctx.reply('Wallpaper - ' + fileName + ' Deleted.');
		} else {
			await unauthorized(ctx);
		}
	}

	if (data.split('_')[0] == 'EdC') {
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
			await unauthorized(ctx);
		}
	}

	if (data.split('_')[0] == 'ChC') {
		chat_id = ctx.update.callback_query.message.chat.id;

		if (
			ctx.update.callback_query.from.id == 975024565 ||
			ctx.update.callback_query.from.id == 934949695 ||
			ctx.update.callback_query.from.id == 1889905927 ||
			ctx.update.callback_query.from.id == 127070302
		) {
			await changeCategory(ctx, wallId, data.split('_')[1]);
			wallId = '';
		} else {
			await unauthorized(ctx);
		}
	}

	if (data.split('_')[0] == 'Upl') {
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
			await unauthorized(ctx);
		}
	}

	if (data.split('_')[0] == "UUpl") {
		chat_id = ctx.update.callback_query.message.chat.id;
		userId = data.split('_')[1];

		let uploader = await Uploader.find({userID: userId});

		if (
			uploader.length > 0
		) {
			await updateUserMethod(ctx, userId);

			userId = '';
		} else {
			await unauthorized(ctx);
		}
	}

	if (data.split('_')[0] == "EUpl") {
		chat_id = ctx.update.callback_query.message.chat.id;
		userId = data.split('_')[1];

		let uploader = await Uploader.find({userID: userId});

		if (
			uploader.length > 0
		) {
			await editUserMenuMethod(ctx, userId);
			userId = '';
		} else {
			await unauthorized(ctx);
		}
	}

	if (data.split('_')[0] == "EUs") {
		chat_id = ctx.update.callback_query.message.chat.id;
		userId = data.split('_')[1];
		let uploader = await Uploader.find({userID: userId});

		if (
			uploader.length > 0
		) {
			console.log(ctx.update.callback_query.from.id)
			editUploaderName.push(ctx.update.callback_query.from.id);

			console.log("Edit Uploader Name Array - ", editUploaderName);

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
			await unauthorized(ctx);
		}
	}

	if (data.split('_')[0] == "RPfp") {
		chat_id = ctx.update.callback_query.message.chat.id;
		userId = data.split('_')[1];
		let uploader = await Uploader.find({userID: userId});

		if (
			uploader.length > 0
		) {
			await removeUploaderPfpMethod(ctx, userId);

			userId = '';
		} else {
			await unauthorized(ctx);
		}
	}

	if (data.split('_')[0] == 'DUpl') {
		chat_id = ctx.update.callback_query.message.chat.id;
		userId = data.split('_')[1];

		if (
			ctx.update.callback_query.from.id == 975024565 ||
			ctx.update.callback_query.from.id == 934949695 ||
			ctx.update.callback_query.from.id == 1889905927 ||
			ctx.update.callback_query.from.id == 127070302
		) {
			await deleteUserMethod(ctx, userId);

			userId = '';
		} else {
			await unauthorized(ctx);
		}
	}

	if (data.split('_')[0] == 'WUpl') {
		page = 0;
		chat_id = ctx.update.callback_query.message.chat.id;
		userId = data.split('_')[1];

		let uploader = await Uploader.find({userID: userId});

		if (
			uploader.length > 0
		) {
			await uploaderWallsMenu(ctx, userId, page);
			userId = '';
		} else {
			await unauthorized(ctx);
		}
	}

	if (data.split('_')[0] == 'UpW') {
		chat_id = ctx.update.callback_query.message.chat.id;
		userId = data.split('_')[1];

		let uploader = await Uploader.find({userID: userId});

		if (
			uploader.length > 0
		) {
			page = data.split('_')[2];

			await uploaderWallsMenu(ctx, userId, page);
		} else {
			await unauthorized(ctx);
		}
	}

	if (data.split('_')[0] == 'Av') {
		chat_id = ctx.update.callback_query.message.chat.id;
		userId = data.split('_')[1];

		let uploader = await Uploader.find({userID: userId});

		if (uploader.length > 0) {
			addAvatar.push(ctx.update.callback_query.from.id);

			console.log("Add Avatar Array - ", addAvatar);

			let editKeyboard = {
				inline_keyboard: [
					[{ text: 'Go back', callback_data: `EUpl_${data.split('_')[1]}` }],
					[{ text: 'Exit', callback_data: 'exit-payload' }],
				],
			};

			await ctx.reply('Please upload a new Profile Pic to show in United Walls. The Picture should be either png or jpg, and should be around 320px - 320px square dimension. Should be in the form of a Document/File and not compressed photo.', {
				reply_markup: editKeyboard,
			});
		} else {
			await unauthorized(ctx);
		}
	}
});

// Check messages
bot.on('message', async (ctx) => {
	if (generateInvitations.includes(ctx.message.from.id)) {
		if (
			ctx.message.from.id == 975024565 ||
			ctx.message.from.id == 934949695 ||
			ctx.message.from.id == 1889905927 ||
			ctx.message.from.id == 127070302
		) {
			await generateInvitationsMethod(ctx);
			generateInvitations = generateInvitations.filter((fil) => { ctx.update.message.from.id != fil });
			console.log("Register Array - ", registers);
			return;
		} else {
			generateInvitations = generateInvitations.filter((fil) => { ctx.update.message.from.id != fil });
			await unauthorized(ctx);
			return;
		}
	}

	if (registers.includes(ctx.message.from.id)) {
		const uploaderExists = await Uploader.find({ userID: ctx.message.from.id });

		if (uploaderExists) {
			await register(ctx);

			registers = registers.filter((fil) => { ctx.update.message.from.id != fil });

			console.log("Register Array - ", registers);
			
			return;
		} else {
			registers = registers.filter((fil) => { ctx.update.message.from.id != fil });
			await unauthorized(ctx);

			console.log("Register Array - ", registers);

			return;
		}
	}

	if (invitation.includes(ctx.message.from.id)) {
		const invitationExists = await Invite.find({token: ctx.update.message.text});
		const currentDate = new Date
		if (invitationExists.length > 0) {
			if (invitationExists[0].expiry > currentDate && invitationExists[i].used === false) {
				// Register User
				invitation = invitation.filter((fil) => { ctx.update.message.from.id != fil });

				await Invite.findOneAndUpdate({ used: true });

				console.log("Invitation Array - ", invitation);

				registers.push(ctx.message.from.id);

				console.log("Register Array - ", registers);

				let editKeyboard = {
					inline_keyboard: [
						[{ text: 'Cancel', callback_data: 'exit-payload' }],
					],
				};

				await ctx.reply('Please enter a password. Should be more than 5 digits, should have alpha-numeric characters, etc. You know the drill.', {
					reply_markup: editKeyboard,
				});
				return;
			} else {
				await ctx.reply("Invitation Code doesn't exist. Who sent you this? Please let us admins know about this in t.me/unitedsetups.");

				await ctx.api.sendMessage(
					-1001731686694,
						`<b>Error</b> - <br><br><b>${ctx.update.message.from.username}</b> tried to use an expired Invitation Code.`, { message_thread_id: 77299, parse_mode: 'HTML' }
					);
			}
		} else {
			invitation = invitation.filter((fil) => { ctx.update.message.from.id != fil });
			await ctx.reply("Invitation Code doesn't exist. Who sent you this? Please let us admins know about this in t.me/unitedsetups.")
			await ctx.api.sendMessage(
				-1001731686694,
					`<b>Error</b> - <br><br><b>${ctx.update.message.from.username}</b> might contact you about how the Invitation Code did not exist.`, { message_thread_id: 77299, parse_mode: 'HTML' }
				);
			console.log("Invitation Array - ", invitation);
			return;
		}
	}

	if (addAvatar.includes(ctx.message.from.id)) {
		await addAvatarMethod(ctx);

		addAvatar = addAvatar.filter((fil) => { ctx.update.message.from.id != fil });

		console.log("Add Avatar Array - ", addAvatar);

		return;
	}

	if (editName.includes(ctx.message.from.id)) {

		await editWallName(ctx, wallId);

		editName = editName.filter((fil) => { ctx.update.message.from.id != fil });
		wallId = '';

		console.log("Edit Name Array - ", editName);

		return;
	}

	if (addUploader.includes(ctx.message.from.id)) {
		await addUploaderMethod(ctx, wallId);

		addUploader = addUploader.filter((fil) => { ctx.update.message.from.id != fil });
		wallId = '';

		console.log("Add Uploader Array - ", addUploader);

		return;
	}

	if (addUploaderID.includes(ctx.message.from.id)) {
		await addUploaderIDMethod(ctx);

		addUploaderID = addUploaderID.filter((fil) => { ctx.update.message.from.id != fil });

		console.log("Add Uploader ID Array - ", addUploaderID);

		return;
	}

	if (editUploaderName.includes(ctx.message.from.id)) {
		console.log('userId', userId);

		await editUploaderUsernameMethod(ctx, userId);

		editUploaderName = editUploaderName.filter((fil) => { ctx.update.message.from.id != fil });
		userId = '';

		console.log("Edit Uploader Name Array - ", editUploaderName);

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
		chat_id = ctx.message.chat.id;

		await ctx.reply(
			`@${msg.from.username} The Wallpapers topic is only for sharing your Wallpapers, you can't message anything there. If you have a wallpaper, share that, or please refrain from using this Topic. Thanks!`
		);
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
		chat_id = ctx.message.chat.id;

		await ctx.reply(
			`@${msg.from.username}, if you want to comment on a Setup please forward it into the corresponding group. The Setups topic itself is only for posting setups.`
		);
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
