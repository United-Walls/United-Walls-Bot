const unauthorized = async (ctx, chat_id) => {
	await ctx.reply(
		`Ok who the fuck? Bro are you lost? If you got this message, it means you either fucked up something, don't have the necessary stuff I need, aren't authorized, or you just a plain dumbass. Now Fuck OFF!`
	);
};

module.exports = unauthorized;
