const Walls = require('../models/Walls');

const wallMenu = async (ctx, data, chat_id) => {
	const wall_id = data.split('_')[1];

	const wall = await Walls.findById(wall_id)
		.populate('category')
		.sort({ file_name: 1 });

	let editKeyboard = {
		inline_keyboard: [
			[{ text: 'Edit Name', callback_data: `EdN_${wall_id}` }],
			[
				{
					text: wall.addedBy == undefined ? 'Add Uploader' : 'Edit Uploader',
					callback_data: `AdU_${wall_id}`,
				},
			],
			[{ text: 'Edit Category', callback_data: `EdC_${wall_id}` }],
			[{ text: 'Delete Wall', callback_data: `Del_${wall_id}` }],
			[{ text: 'Go back', callback_data: `Cat_${wall.category.id}` }],
			[{ text: 'Exit', callback_data: 'exit-payload' }],
		],
	};

	await ctx.api.sendDocument(chat_id, wall.file_id);
	await ctx.reply(`Edit ${wall.file_name}?`, {
		reply_markup: editKeyboard,
	});
};

module.exports = wallMenu;
