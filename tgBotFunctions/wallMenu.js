const Walls = require('../models/Walls');

const wallMenu = async (ctx, messageToUpdate, data) => {
	const wall_id = data.split('_')[1];

	const wall = await Walls.findById(wall_id)
		.populate('category')
		.sort({ file_name: 1 });

	let editKeyboard = {
		inline_keyboard: [
			[{ text: 'Edit Name', callback_data: `EdN_${wall_id}` }],
			[{ text: 'Edit Category', callback_data: `EdC_${wall_id}` }],
			[{ text: 'Delete Wall', callback_data: `Del_${wall_id}` }],
			[{ text: 'Go back', callback_data: `go-back-from-edit-payload` }],
			[{ text: 'Exit', callback_data: 'exit-payload' }],
		],
	};

	await ctx.api.sendDocument(messageToUpdate.message.chatId, wall.file_id);
	const message = await ctx.reply(`Edit ${wall.file_name}?`, {
		reply_markup: editKeyboard,
	});

	return message;
};

module.exports = wallMenu;
