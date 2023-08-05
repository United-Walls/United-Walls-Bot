const Walls = require('../models/Walls');

const editWallName = async (ctx, messageToUpdate, wallId) => {
	const newFileName = ctx.message.text;

	if (newFileName != undefined) {
		await Walls.findByIdAndUpdate(wallId, { file_name: newFileName });
		await ctx.api.editMessageText(messageToUpdate.message.chatId, messageToUpdate.message.id, 'Wall updated with name - ' + newFileName, { reply_markup: {}, message_thread_id: messageToUpdate.message.message_thread_id });
	}
};

module.exports = editWallName;
