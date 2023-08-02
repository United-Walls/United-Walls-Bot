const deleteMessage = async (
	ctx,
	chatId,
	messageToDelete,
) => {
	try {
		for(let i = 0; i < messageToDelete.length; i++) {
			let msgId = await ctx.api.copyMessage(chatId, chatId, messageToDelete[i]);
			await ctx.api.deleteMessage(chatId, messageToDelete[i]);
		}
	} catch (err) {
		console.error(err);
	}
};

module.exports = deleteMessage;
