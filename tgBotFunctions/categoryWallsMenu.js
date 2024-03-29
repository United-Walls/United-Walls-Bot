const Category = require('../models/Category');

const categoryWallsMenu = async (ctx, messageToUpdate, data) => {
	const category_id = data.split('_')[1];

	const category = await Category.findById(category_id).populate({
		path: 'walls',
		options: {
			sort: { file_name: 1 },
			collation: { locale: 'en_US', numericOrdering: true },
		},
	});

	let editKeyboard = { inline_keyboard: [] };
	let wallsMapped = [];

	await Promise.all(
		category.walls.map((wall) => {
			wallsMapped.push({
				text: wall.file_name,
				callback_data: `Wal_${wall.id}`,
			});
		})
	);

	let array = [];

	for (let i = 0; i < wallsMapped.length; i++) {
		let mappedWall = wallsMapped[i];

		if (wallsMapped.length > 2) {
			array.push(mappedWall);

			if ((i + 1) % 2 == 0) {
				editKeyboard.inline_keyboard.push(array);
				array = [];
			}

			if (i == wallsMapped.length - 1 && wallsMapped.length % 2 != 0) {
				editKeyboard.inline_keyboard.push([mappedWall]);
			}
		} else {
			editKeyboard.inline_keyboard.push([mappedWall]);
		}
	}

	editKeyboard.inline_keyboard.push([
		{
			text: 'Go back',
			callback_data: 'edit-payload',
		},
	]);

	editKeyboard.inline_keyboard.push([
		{ text: 'Exit', callback_data: 'exit-payload' },
	]);

	await ctx.api.editMessageText(messageToUpdate.message.chatId, messageToUpdate.message.id, `Choose a Wallpaper to edit -`, { reply_markup: editKeyboard, message_thread_id: messageToUpdate.message.message_thread_id });
};

module.exports = categoryWallsMenu;
