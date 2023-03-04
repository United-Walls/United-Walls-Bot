const deleteMessage = async (
	ctx,
	chat_id,
	messageToDelete,
	messageToDelete2
) => {
	if (chat_id != null && chat_id != undefined && chat_id != 0) {
		if (
			messageToDelete != null &&
			messageToDelete != undefined &&
			messageToDelete != 0
		) {
			await ctx.api.deleteMessage(chat_id, messageToDelete);
		}

		if (
			messageToDelete2 != null &&
			messageToDelete2 != undefined &&
			messageToDelete2 != 0
		) {
			await ctx.api.deleteMessage(chat_id, messageToDelete2);
		}
	}
};

module.exports = deleteMessage;
