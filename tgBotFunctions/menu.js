const menuMethod = async (ctx, flag, inlineKeyboard) => {
	const username = flag
		? ctx.update.message.from.username
		: ctx.update.callback_query.from.username;
	return await ctx.reply(
		`Welcome to the United Walls Menu. Below are settings to manipulate the Wallpapers added in the Database. So, @${username} what you want to do?`,
		{ reply_markup: inlineKeyboard, message_thread_id: ctx.update.message.message_thread_id }
	);
};

module.exports = menuMethod;
