const unauthorized = async (ctx, chat_id, messageToDelete) => {
	await ctx.reply(
		`Ok who the fuck? You're not allowed to use this bot Motherfucker! Fuck off!`
	);

	setTimeout(() => {
		ctx.api.deleteMessage(chat_id, messageToDelete);
	}, 3500);
};

module.exports = unauthorized;
