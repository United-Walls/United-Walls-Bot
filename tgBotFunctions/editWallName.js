const Walls = require('../models/Walls');

const editWallName = async (ctx, wallId) => {
	const newFileName = ctx.update.message.text;

	if (newFileName != undefined) {
		await Walls.findByIdAndUpdate(wallId, { file_name: newFileName });
		await ctx.reply('Wall updated with name - ' + newFileName, {message_thread_id: ctx.update.callback_query.message.message_thread_id});
	}
};

module.exports = editWallName;
